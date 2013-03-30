views.MultiSeries = Backbone.View.extend

  initialize: (opts={}) ->
    _.bindAll @

    @margin =
      top     : 20
      right   : 200
      bottom  : 30
      left    : 50
    @width = @$el.width() - @margin.right - @margin.left
    @height = 500 - @margin.top - @margin.bottom


    @x = d3.time.scale().range [0, @width]
    @y = d3.scale.linear().range [@height, 0]

    @xAxis = d3.svg.axis().scale(@x).orient("bottom")
    @yAxis = d3.svg.axis().scale(@y).orient("left")

    @color = d3.scale.category10()

    @line = d3.svg.line()
      .x( (d) => return @x d.x() )
      .y( (d) => return @y d.y() )

    className = @$el.attr "class"

    @svg = d3.select(".#{className}").append("svg")
      .attr("width",  @width + @margin.left + @margin.right)
      .attr("height", @height + @margin.top + @margin.bottom)
      .append("g")
      .attr("transform", "translate(" + @margin.left + "," + @margin.top + ")")



  render: ->

    @color.domain @collection.keys()
    questions = @color.domain().map @collection.chartMap

    @x.domain d3.extent @collection.models, (d)=> return d.x()

    min = d3.min questions, (c)=> return d3.min c.values, (v)=> return v.y()
    max = d3.max questions, (c)=> return d3.max c.values, (v)=> return v.y()

    @y.domain [0.5*min, 1.1*max]


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
      .attr("dy", ".35em")
      .text( (d) => return if d.value? then d.name else "" )

    @