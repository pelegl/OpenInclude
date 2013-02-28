((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
    
  class exports.DiscoverChartPopup extends @Backbone.View   
    tagName: "div"
    className: "popover"

    initialize: ->
      @moduleName = $("<h4 />").addClass("moduleName")
      @moduleLanguage = $("<h5 />").addClass("moduleLanguage")
                                   .append("<span class='color' />")
                                   .append("<span class='name' />")
      @moduleDescription = $("<p />").addClass("moduleDescription")
      @moduleStars = $("<div />").addClass("moduleStars")
      
      @render()
          
    render: ->
      @$el.appendTo @options.scope
      @$el.hide().append @moduleName, @moduleLanguage, @moduleDescription, @moduleStars      
      @
      
    show: ->      
      @$el.show()
      @
      
    hide: ->
      @$el.hide()
      @
      
    setData: (datum, $this, scope) ->            
      width = height = parseInt($this.attr("r"))*2
      x = parseInt $this.attr "cx"
      y = parseInt $this.attr "cy"
      color = $this.css "fill"
      data = datum.get("_source")      
      stars = data.watchers            
      lastContribution = humanize.relativeTime new Date(data.pushed_at).getTime()/1000
      
      activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>#{lastContribution}</strong>")
      activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>#{stars} stars</strong> on GitHub")
      
      @moduleName.text data.module_name          
      @moduleLanguage
                     .find(".name").text(data.language).end()
                     .find(".color").css({background: color})    
      @moduleDescription.text data.description
      @moduleStars.html("").append activity, activityStars      
                              
      @show()
      @$el.css
        bottom: (@options.scope.outerHeight()-y-(@$el.outerHeight()/2)-15)+'px'
        left: x+@options.margin.left+(width/2)+15+'px'
      
  class exports.DiscoverFilter extends @Backbone.View
    events:
      "change input[type=checkbox]" : "filterResults"
      "click [data-reset]" : "resetFilter"
    
    initialize: ->
      _.bindAll this, "render"
      
      @context =
        filters: [
          {name: "Language", key: "languageFilters"}
        ]
      
      @listenTo @collection, "reset", @render
      @render()
    
    resetFilter: (e)->
      $this = $(e.currentTarget)
      $this.closest(".filterBox").find("input[type=checkbox]").prop("checked", false)
      @collection.filters = []
      @collection.trigger "filter"
      return false
    
    filterResults: (e)->
      $this = $(e.currentTarget)
      languageName = $this.val()
      
      if $this.is(":checked")
        @collection.filters[languageName] = true
      else
        delete @collection.filters[languageName]
        
      @collection.trigger "filter"
          
    render: ->      
      @context.filters[0].languages = @collection.languageList()
      html = views['discover/filter'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discoverFilter'
      @
        
    
  class exports.DiscoverComparison extends @Backbone.View
    events: 
      "click [data-sort]" : "sortComparison"
    
    sortComparison: (e)->
      $this = $(e.currentTarget)      
      ###
        sort key
      ###
      key = $this.data("sort")
      
      ###
        set active on the element in the context, remove active from the previous element
      ###
      index = $this.closest("th").index()
      ###
        get sort direction      
      ###      
      direction = if @context.headers[index].directionBottom is true then "ASC" else "DESC"      

      _.each @context.headers, (v,k)=>
        v.active = false
        v.directionBottom = true      
      
      @context.headers[index].active = true
      @context.headers[index].directionBottom = if direction is "DESC" then true else false
        
      
      @collection.sortBy key, direction
      false      
      
    initialize: ->
      _.bindAll this, "render"
      @listenTo @collection, "all", @render
      
      @context = 
        headers : [
          {name: "Project Name", key: "_source.module_name"}
          {name: "Language", key: "_source.language"}
          {name: "Active Contributors"}
          {name: "Last Commit", key: "_source.pushed_at"}
          {name: "Stars on GitHub", key: "_source.watchers"}
          {name: "Questions on StackOverflow"}
          {name: "Percentage answered"}
        ]
      @render()  
            
    render: ->
      @context.projects = @collection.toJSON()
        
      html = views['discover/compare'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discoverComparison'
      @

  class exports.DiscoverChart extends View
    initialize: ->
      @listenTo @collection, "reset" , @renderChart
      @listenTo @collection, "filter", @renderChart
      
      @margin =
        top:        19.5
        right:      19.5
        bottom:     60
        left:       50
      @padding    = 30
      @maxRadius  = 50
      @width      = @$el.width() - @margin.right - @margin.left
      @height     = @width*9/16
      
      @xScale     = d3.scale.linear().domain([0,4]).range([0, @width])
      @yScale     = d3.scale.linear().domain([0,1.1]).range([@height, 0])
      
      @colorScale = d3.scale.category20c()
      
      _.bindAll this, "renderChart", "position", "order"
      
      @popupView = new exports.DiscoverChartPopup { margin: @margin, scope: @$el }      
            
      @render()
            
    setRadiusScale: ()->
      @radiusScale = d3.scale.sqrt().domain([10, @collection.maxRadius()]).range([5, @maxRadius])
    
    formatterX : (d,i)->
      switch d
        when 0.5 then return "<1 week ago"
        when 1.5 then return "< 1 month ago"
        when 2.5 then return "< 6 months ago"
        when 3.5 then return "> 6 months ago"
      
    position: (dot)->
      dot
         .attr("cx", (d)=> @xScale( d.x() ))
         .attr("cy", (d)=> @yScale( d.y(@collection.maxScore) ))
         .attr("r" , (d)=> @radiusScale( d.radius() ))
               
    order: (a,b) ->  
      return b.radius() - a.radius()
    
    popup: (action, scope)->
      self = @
      return (d,i)-> # return this - reference to current target
        switch action
          when 'hide' then self.popupView.hide()
          when 'show' then self.popupView.setData d, $(this), scope
    
    addToComparison: (document, index)->
      app.view.comparisonData.add document
      
    renderChart: ->      
      @setRadiusScale()
      
      languages = _.keys @collection.filters
      if languages.length > 0
        data = @collection.filter (module)=>          
          return $.inArray(module.get("_source").language, languages) isnt -1
      else
        data = @collection.models
      
      @dot = @dots.selectAll(".dot")
                    .data(data)                  
                  
      @dot.enter().append("circle")
                      .attr("class", "dot")                                           
                      .on("mouseover", @popup('show', @$el))
                      .on("mouseout", @popup('hide'))
                      .on("click", @addToComparison)
                      
                      
      @dot.transition()
          .style("fill", (moduleModel)=> @colorScale(moduleModel.color()) )
          .call(@position)
                  
      @dot.exit().transition()
          .attr("r", 0)
          .remove()            
      
      @dot.append("title").text((d)=> d.get("_source").module_name)
      @dot.sort(@order)
                             
      @
      
    render: ->
      @xAxis = d3.svg.axis()
                     .orient("bottom")
                     .scale(@xScale)
                     .tickValues([0.5,1.5,2.5,3.5])
                     .tickFormat(@formatterX)
      
      @yAxis = d3.svg.axis()
                     .scale(@yScale)
                     .orient("left")
                     .tickValues([1])
                     .tickFormat((d,i)=>return if d is 1 then "100%" else "")
      
      
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
  
  class exports.Discover extends View
    events: 
      'submit .search-form' : 'searchSubmit'
    
    initialize:->
      console.log '[__discoverView__] Init'
      
      _.bindAll this, "fetchSearchData", "render", "searchSubmit"    
      
              
      qs = root.help.qs.parse(location.search)
      @context.discover_search_query = decodeURI(qs.q) if qs.q?      
      @context.discover_search_action = "/discover"
      
      @render()
      
      ###
        initializing chart
      ###
      @chartData      = new root.collections.Discovery
      @comparisonData = new root.collections.DiscoveryComparison
      @filter         = new exports.DiscoverFilter { el: @$(".filter"), collection: @chartData }
      @chart          = new exports.DiscoverChart { el: @$("#searchChart"), collection: @chartData }
      @comparison     = new exports.DiscoverComparison { el: @$("#moduleComparison"), collection: @comparisonData }
      
            
      if qs.q? then @fetchSearchData qs.q        
    
    searchSubmit: (e)->
      e.preventDefault()
      q = @$("[name=q]").val()
      {pathname} = window.location
      app.navigate "#{pathname}?q=#{q}", {trigger: false}
      @fetchSearchData q            
    
    fetchSearchData: (query) ->
      @chart.collection.fetch query

    render:->  
      html = views['discover/index'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discover'
      @
  

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)