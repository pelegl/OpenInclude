views.Series = Backbone.View.extend
  initialize: (opts={}) ->
    _.bindAll @
    {@types, @title} = opts

    @margin =
      top     : 20
      right   : 100
      bottom  : 30
      left    : 50
    @width = @$el.width() - @margin.right - @margin.left
    @height = 300 - @margin.top - @margin.bottom


    @x = d3.time.scale().range [0, @width]
    @y = d3.scale.linear().range [@height, 0]


    @xAxis = d3.svg.axis().scale(@x).orient("bottom").ticks(4)
    @yAxis = d3.svg.axis().scale(@y).orient("left")


    @line = d3.svg.line()
      .x( (d) => return @x d.x() )
      .y( (d) => return @y d.y )


    className = @$el.attr "class"

    @svg = d3.select(".#{className}").append("svg")
      .attr("width",  @width + @margin.left + @margin.right)
      .attr("height", @height + @margin.top + @margin.bottom)
      .append("g")
      .attr("transform", "translate(" + @margin.left + "," + @margin.top + ")")

  render: ->
    ###
    TODO: fix data
    ###

    data = @collection.filter (item)=>
      return item.get("type") in @types

    prev = 0
    data.forEach (d)=>
      d.y = ++prev

    @x.domain d3.extent data, (d)=> return d.x()
    @x.nice d3.time.day

    @y.domain d3.extent data, (d)=> return d.y

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


