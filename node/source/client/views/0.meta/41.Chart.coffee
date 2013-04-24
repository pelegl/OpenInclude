class views.Chart extends View
  stopLoader: false
  _progress: 0
  meter: null

  createMeter: ->
    unless @meter
      @arc = d3.svg.arc()
        .startAngle(0)
        .endAngle(0)
        .innerRadius(80)
        .outerRadius(80)

      @meter = @svg.append("g")
        .attr("class", "progress-meter")
        .attr("transform", "translate(" + @width / 2 + "," + @height / 2 + ")")

      twoPi = 2 * Math.PI
      step = twoPi / 12

      i = 0
      @loader = []
      while i < twoPi
        @loader.push @meter.append("circle")
          .attr("transform", (d) => "translate(" + @arc.centroid() + ")")
          .attr("r", 15)
          .style("fill", d3.rgb(200, 200, 200))
        i += step
        @arc.startAngle(i)
        @arc.endAngle(i)

  progress: (loaded, total) ->
    if loaded is 0
      @_progress = 0
      @createMeter()

    twoPi = 2 * Math.PI
    step = twoPi / 12

    radius = (i for [0..11])
    colors  = []

    start = @_progress-5
    max_radius = 20
    for i in [@_progress-5 .. @_progress]
      percent = (i - start)/6
      x = if i < 0 then 12+i else i

      radius[x] = percent*max_radius
      colors[x]  = percent * 200

    for i in [0..11]
      color = colors[i] || 0
      @loader[i].attr("r", radius[i]).style("fill", d3.rgb(color,color,color))

    @_progress += 1
    @_progress = 0 if @_progress > 11

    if loaded is 0
      if @timer
        clearInterval(@timer)
      @timer = setInterval(_.bind(@progress, @, loaded + 1, total), 100)

  stopProgress: ->
    if @timer
      clearInterval(@timer)
    @_progress = 0
    if @meter
      @meter.transition().duration(100)
        .attr("r", 0)
        .remove()
      delete @meter

  renderChart: ->
    if @meter
      transform = @meter.attr("transform")
      @meter.transition().each("end", => @renderChartReal()).attr("transform", "#{transform} scale(0)").remove()
      delete @meter
    else
      @renderChartReal()