class views.Series extends Backbone.View
  stopLoader: false
  _progress: 0

  initialize: (opts={}) ->
    _.bindAll @
    {@types, @title} = opts

    @margin =
      top     : 20
      right   : 100
      bottom  : 30
      left    : 50

    @line = d3.svg.line()
      .x( (d) => return @x d.x() )
      .y( (d) => return @y d.y )

    $(window).on "resize", @resizeContent

    @render()

  remove: ->
    $(window).off "resize", @resizeContent
    super

  resizeContent: ->
    @$el.empty()
    @render()
    @renderChartReal() if @collection.length > 0

  createMeter: ->
    unless @meter
      @arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(60)
        .outerRadius(80)

      className = @$el.attr "class"

      @meter = @svg.append("g")
        .attr("class", "progress-meter")
        .attr("transform", "translate(" + @width / 2 + "," + @height / 2 + ")")

      @meter.append("path")
        .attr("class", "background")
        .attr("d", @arc.endAngle(2 * Math.PI))

      @foreground = @meter.append("path")
        .attr("class", "foreground")

      @text = @meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")

  progress: (loaded, total) ->
    if loaded is 0
      @stopLoader = false
      @_progress = 0
      @createMeter()

    twoPi = 2 * Math.PI
    formatPercent = d3.format(".0%");

    i = d3.interpolate(@_progress, loaded / total)

    d3.transition().tween("progress", =>
      (t) =>
        @_progress = i(t);
        if @_progress >= 100
          @_progress = 0
        @foreground.attr("d", @arc.endAngle(twoPi * @_progress))
      #@text.text(formatPercent(@_progress))
    )

    unless @stopLoader
      setTimeout(_.bind(@progress, @, loaded + 1, total), 100)

  stopProgress: ->
    @stopLoader = true

  render: ->
    console.log "[__ render series __]"

    if @collection.length is 0
      return

    @width = @$el.width() - @margin.right - @margin.left
    @height = 300 - @margin.top - @margin.bottom

    @x = d3.time.scale().range [0, @width]
    @y = d3.scale.linear().range [@height, 0]

    @xAxis = d3.svg.axis().scale(@x).orient("bottom").ticks(4)
    @yAxis = d3.svg.axis().scale(@y).orient("left").ticks(4)


    className = @$el.attr "class"

    @svg = d3.select(".#{className}").append("svg")
      .attr("width",  @width + @margin.left + @margin.right)
      .attr("height", @height + @margin.top + @margin.bottom)
      .append("g")
      .attr("transform", "translate(" + @margin.left + "," + @margin.top + ")")

  renderChart: ->
    if @meter
      transform = @meter.attr("transform")
      @meter.transition().each("end", => @renderChartReal()).attr("transform", "#{transform} scale(0)").remove()
      delete @meter

  renderChartReal: ->
    data = @collection.filter (item)=>
      return item.get("type") in @types

    prev = 0
    data.forEach (d)=>
      d.y = ++prev

    if data.length > 0
      @x.domain d3.extent data, (d)=> return d.x()
      @x.nice d3.time.day

      @y.domain d3.extent data, (d)=> return d.y
      @y.nice()

    @svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + @height + ")")
      .call(@xAxis);

    @svg.append("g")
      .attr("class", "y axis")
      .call(@yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(@title)

    @svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", @line)