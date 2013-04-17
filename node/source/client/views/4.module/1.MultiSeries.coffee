class views.MultiSeries extends Backbone.View
  stopLoader: false
  _progress: 0

  initialize: (opts={}) ->
    _.bindAll @

    @margin =
      top     : 20
      right   : 50
      bottom  : 30
      left    : 50

    @color = d3.scale.category10()

    @line = d3.svg.line()
      .x( (d) => return @x d.x() )
      .y( (d) => return @y d.y() )

    $(window).on "resize", @resizeContent

    @render()

  remove: ->
    $(window).off "resize", @resizeContent
    super

  resizeContent: ->
    @$el.empty()
    @render()
    @renderChartReal() if @collection.models.length > 0

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
    @width = @$el.width() - @margin.right - @margin.left
    @height = 500 - @margin.top - @margin.bottom

    @x = d3.time.scale().range [0, @width]
    @y = d3.scale.linear().range [@height, 0]

    @xAxis = d3.svg.axis().scale(@x).orient("bottom").ticks(6)
    @yAxis = d3.svg.axis().scale(@y).orient("left").ticks(6)

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
    @color.domain @collection.keys()
    questions = @color.domain().map @collection.chartMap

    @x.domain d3.extent @collection.models, (d)=> return d.x()
    @x.nice d3.time.month


    min = d3.min questions, (c)=> return d3.min c.values, (v)=> return v.y()
    max = d3.max questions, (c)=> return d3.max c.values, (v)=> return v.y()

    if min is 0 and max is 0
      min = -1
      max = 1
      @yAxis.tickValues([0]).tickFormat d3.format("f.0")
    else
      min *= 0.9
      max *= 1.1

    @y.domain [min,max]
    @y.nice()


    @svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + @height + ")")
      .call(@xAxis)

    @svg.append("g")
      .attr("class", "y axis")
      .call(@yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Questions")

    question = @svg.selectAll(".question")
      .data(questions)
      .enter().append("g")
      .attr("class", "question")

    question.append("path")
      .attr("class", "line")
      .attr("d",       (d)=> return @line  d.values  )
      .style("stroke", (d)=> return @color d.name    )

    question.append("text")
      .datum( (d) => return {name: d.name, value: d.values[d.values.length - 1]} )
      .attr("transform", (d) =>
        x = if d.value? then @x(d.value.x()) else 0
        y = if d.value? then @y(d.value.y()) else 0
        return "translate(#{x},#{y})" )
      .attr("x", 10)
      .attr("dy", "-1em")
      .style("text-anchor", "end")
      .text( (d) => return if d.value? then d.name else "" )

    @