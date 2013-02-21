((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      console.log '[__metaView__] Init'      

  class View extends @Backbone.View
    tagName:'section'
    className: 'contents'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
      unless opts.el?
        opts.el = $("<section class='contents' />")
        if app.meta.$('.contents').length > 0
          app.meta.$('.contents').replaceWith(opts.el)
        else          
          app.meta.$el.append(opts.el)     
      else
        $(window).scrollTop 0      
      super opts
      
  
  
  class exports.Index extends View
    initialize:->
      console.log '[__indexView__] Init'
      @context = 
        title: "Home Page"
        STATIC_URL : app.conf.STATIC_URL
        in_stealth_mode: false
            
      @render()

    render:->  
      html = views['index'](@context)
      @$el.html html
      @$el.attr 'view-id', 'index'
      @
  
  ###
  chartClass.prototype.popup = function(action, scope){
      return function(d,i){
        if ( action === 'hide' ){
          popup.hide();
        } else {
          var marginLeft = 50,
            $this = $(this),
            width = height = parseInt($this.attr("r"))*2,
            x = parseInt($this.attr("cx")),
            y = parseInt($this.attr("cy")),
            color = $this.css("fill");
            
          
          var data = d._source,
            stars = data.watchers,            
            lastContribution = humanize.relativeTime(new Date(data.pushed_at).getTime()/1000);
          
          var activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>"+lastContribution+"</strong>"),
            activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>"+stars+" stars</strong> on GitHub"); 
                      
          $(".moduleName", popup).text(data.module_name);
          $(".moduleLanguage", popup)
            .find(".name").text(data.language).end()
            .find(".color").css({background: color});
          $(".moduleDescription", popup).text(data.description);                    
          $(".moduleStars", popup).html("").append(activity, activityStars);
                                
          popup.show()
             .css({
              bottom: (scope.outerHeight()-y-(popup.outerHeight()/2)-15)+'px',
              left: x+marginLeft+(width/2)+15+'px'
             });
        }
      }
    }
  ###
  
  
  ###
  var popup = $("<div />").addClass("popover").hide().appendTo("#searchChart")
                .append("<h4 class='moduleName' />")
                .append("<h5 class='moduleLanguage' ><span class='color'></span><span class='name'></span></h5>")
                .append("<p class='moduleDescription' />")
                .append("<div class='moduleStars' ></div>");
  ###
  
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
      
  
  class exports.DiscoverComparison extends @Backbone.View
    initialize: ->
      @context = {}
      
    render: ->
      html = views['discover/compare'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discoverComparison'
      @
      
             

  class exports.DiscoverChart extends View
    initialize: ->
      @listenTo @collection, "reset", @renderChart
      
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
      
    renderChart: ->      
      @setRadiusScale()
      
      @dot = @dots.selectAll(".dot")
                    .data(@collection.models)                  
                  
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
      
      @context = 
        discover_search_action : "/discover"
        STATIC_URL : app.conf.STATIC_URL
      
      qs = root.help.qs.parse(location.search)
      @context.discover_search_query = decodeURI(qs.q) if qs.q?
            
      @render()
      
      ###
        initializing chart
      ###
      @chartData = new root.collections.Discovery
      @comparisonData = new root.collections.DiscoveryComparison
      @chart      = new exports.DiscoverChart { el: @$("#searchChart"), collection: @chartData }
      @comparison = new exorts.DiscoverComparison { el: @$(".moduleComparison"), collection: @comparisonData }      
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
).call(this, (window.views = {}))