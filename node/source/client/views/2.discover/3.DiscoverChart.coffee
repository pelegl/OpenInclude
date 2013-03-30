views.DiscoverChart = View.extend
  initialize: ->
    @listenTo @collection, "filter", @renderChart

    @margin =
      top:        55
      right:      19.5
      bottom:     60
      left:       50
    @padding    = 30
    @maxRadius  = 50
    @width      = @$el.width() - @margin.right - @margin.left
    @height     = @width*9/16

    @xScale     = d3.scale.linear().domain([0,5.25]).range([0, @width])
    @yScale     = d3.scale.linear().domain([0,1]).range([@height, 0])

    @colorScale = d3.scale.category20c()

    _.bindAll this, "renderChart", "order", "formatterX", "addToComparison"

    @popupView = new views.DiscoverChartPopup { margin: @margin, scope: @$el }

    @render()

  render: ->
    @xAxis = d3.svg.axis()
      .orient("bottom")
      .scale(@xScale)
      .tickValues(@xTicks)
      .tickFormat(@formatterX)

    @yAxis = d3.svg.axis()
      .scale(@yScale)
      .orient("left")
      .tickValues([1])
      .tickFormat((d,i)-> return if d is 1 then "100%" else "")


    @svg = d3.select(@$el[0]).append("svg")
      .attr("width",  @width  + @margin.left + @margin.right)
      .attr("height", @height + @margin.top  + @margin.bottom)
      .append("g")
      .attr("transform", "translate( #{@margin.left} , #{@margin.top} )")


    @svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, #{@height} )")
      .call(@xAxis)

    @svg.append("g")
      .attr("class", "y axis")
      .call(@yAxis)

    @svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", @width/2)
      .attr("y", @height + @margin.bottom - 10)
      .text("Last commit")

    @svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("y", 6)
      .attr("x", -@height/2)
      .attr("dy", "-1em")
      .attr("transform", "rotate(-90)")
      .text("Relevance")

    @dots = @svg.append("g").attr("class", "dots")
    @

  ###
    Helper functions
  ###

  setRadiusScale: ()->
    @radiusScale = d3.scale.sqrt().domain([10, @collection.maxRadius()]).range([5, @maxRadius])

  xTicks : [0.75,1.75,3,4.5]

  formatterX : (d,i)->
    ###
    We interpolate data in the buckets, so that
      0.25 to 1 is the 1st bucket,
      1 to 1.75 is the second,
      1.75 to 3 is the 3rd,
      3 to 5 is the last one
    ###
    switch d
      when @xTicks[0] then return "1 week ago"
      when @xTicks[1] then return "1 month ago"
      when @xTicks[2] then return "6 months ago"
      when @xTicks[3] then return "1+ year ago"

  order: (a,b) ->
    return b.radius - a.radius

  popup: (action, scope)->
    self = @
    return (d,i)-> # return this - reference to current target
      switch action
        when 'hide' then self.popupView.hide()
        when 'show' then self.popupView.setData d, $(this), scope

  addToComparison: (document, index)->
    app.view.comparisonData.add @collection.get(document.key)

  collide: (node) ->
    r = node.radius + 4
    nx1 = node.x - r
    nx2 = node.x + r
    ny1 = node.y - r
    ny2 = node.y + r
    return (quad, x1, y1, x2, y2) ->
      if quad.point and quad.point.x isnt node.x and quad.point.y isnt node.y
        x = node.x - quad.point.x
        y = node.y - quad.point.y

        l = Math.sqrt(x * x + y * y)
        r = node.radius + quad.point.radius
        if l < r
          l = (l - r) / l * .5
          node.x -= x *= l
          node.y -= y *= l
          quad.point.x += x
          quad.point.y += y

      return x1 > nx2 or x2 < nx1 or y1 > ny2 or y2 < ny1

  ###
    Render chart
  ###
  renderChart: ->
    @setRadiusScale()

    languages = _.keys @collection.filters

    if languages.length > 0
      data = @collection.filter (module)=>
        return $.inArray(module.get("_source").language, languages) isnt -1
    else
      data = []

    data = data.map (doc)=>
      return {
      x: @xScale doc.x()
      y: @yScale doc.y @collection.maxScore
      radius: @radiusScale doc.radius()
      color:  doc.color()
      name:   doc.name()
      source: doc.get("_source")
      key:    doc.key()
      }

    ###
      Collision changes
    ###
    preventCollision = (times)=>
      q = d3.geom.quadtree(data)
      i = 0
      n = data.length

      while ++i < n
        q.visit @collide data[i]

      preventCollision(times) if --times > 0

    preventCollision(2)

    @dot = @dots.selectAll(".dot")
      .data(data, (d)-> return d.key)

    @dot.enter().append("circle")
      .attr("class", "dot")
      .on("mouseover", @popup('show', @$el))
      .on("mouseout", @popup('hide'))
      .on("click", @addToComparison)
      .style("fill", (d)=> d.color )
      .transition()
      .attr("cx", (d)-> d.x)
      .attr("cy", (d)-> d.y)
      .attr("r", (d)-> d.radius)

    @dot.exit()
      .transition()
      .attr("r", 0)
      .remove()

    @dot.sort(@order)

