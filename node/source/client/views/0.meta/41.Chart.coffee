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
      @stopLoader = false
      @_progress = 0
      @createMeter()

    twoPi = 2 * Math.PI
    step = twoPi / 12

    if @_progress is 0
      @loader[11].attr("r", 15)
    else
      @loader[@_progress - 1].attr("r", 15).style("fill", d3.rgb(200, 200, 200))

    @loader[@_progress].attr("r", 20).style("fill", d3.rgb(100, 100, 100))

    @_progress += 1
    if @_progress > 11
      @_progress = 0

    unless @stopLoader
      setTimeout(_.bind(@progress, @, loaded + 1, total), 500)

  stopProgress: ->
    @stopLoader = true
    @_progress = 0

  renderChart: ->
    if @meter
      transform = @meter.attr("transform")
      @meter.transition().each("end", => @renderChartReal()).attr("transform", "#{transform} scale(0)").remove()
      delete @meter
    else
      @renderChartReal()