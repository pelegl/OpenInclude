((exports) ->  
  root = @
  views = @hbt = _.extend({}, dt, Handlebars.partials)
  {qs} = root.help
  modules_url = "/modules"
  
      
  class exports.Series extends @Backbone.View
    initialize: (opts={}) ->
      _.bindAll @
      
      console.log opts
      
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
            
      
      @xAxis = d3.svg.axis().scale(@x).orient("bottom")
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
      
      
    
  ###
    @constructor
    Multi series chart view
  ###  
  class exports.MultiSeries extends @Backbone.View
    
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
      
      
  
  ###
    @constructor
    Repository view 
  ###
  class exports.Repo extends View
    events: {}
    
    initialize: (opts={})->      
      {@language, repo} = opts
      
      try
        [@owner, @repo] = decodeURI(repo).split "|"
        throw "Incorrect link" if !@owner or !@repo           
      catch e then console.log e
        
          
      @model             = new models.Repo {@language, module_name: @repo, @owner}
      
      ###
        context
      ###
      @context =
        modules_url : modules_url      
      
      ###
        events
      ###
      _.bindAll @ 
      
      @listenTo @model, "sync", @render
      @listenTo @model, "sync", @initCharts
      
      @collections = {}
      @charts      = {}
      ###
        setup render and load data
      ###
      preloadedData = @$("[data-repo]")
      if preloadedData.length > 0
        @model.set preloadedData.data("repo"), {silent: true}        
        @render()
        @initCharts()
      else
        @model.fetch()
    
    initCharts: ->
      ###
        inits
      ###
      @initSO()
      @initGE()
      ###
        Setup listeners
      ###
      @listenTo @collections.stackOverflow, "sync", @charts.stackOverflow.render
      @listenTo @collections.githubEvents,  "sync", @charts.githubCommits.render
      @listenTo @collections.githubEvents,  "sync", @charts.githubWatchers.render      
      ###
        Start fetching data
      ###
      @collections.stackOverflow.fetch()
      @collections.githubEvents.fetch()      
      
    initSO: ->
      options = {@language, @owner, @repo}
      # create collection and associated chart
      @collections.stackOverflow = so = new collections.StackOverflowQuestions options 
      @charts.stackOverflow      = new exports.MultiSeries {el: @$(".stackQAHistory"), collection: so}         
    
    # Github Events
    initGE: ->    
      options = {@language, @owner, @repo}
      # create collection and associated chart
      @collections.githubEvents = ge = new collections.GithubEvents options 
      
      @charts.githubCommits      = new exports.Series {el: @$(".commitHistory"), collection: ge, types: ["PushEvent"], title: "Commits over time"}
      @charts.githubWatchers     = new exports.Series {el: @$(".starsHistory"),  collection: ge, types: ["WatchEvent"], title: "Watchers over time"}
            
    render: ->
      @context.module = @model.toJSON()
      
      html = views['module/view'](@context)      
      @$el.html html            
      @$el.attr 'view-id', 'module-list'
      @      
  
  class exports.ModuleList extends View
    events:
      'click .pagination a' : "changePage"

    initialize: (opts)->
      console.log '[__ModuleListView__] Init'      
      @language = opts.language
      
      @context = 
        modules_url : modules_url
        language    : @language.capitalize()
              
      {page, limit} = qs.parse window.location.search
      page  = if page   then parseInt(page)   else 0
      limit = if limit  then parseInt(limit)  else 30
      
      ###
        Init collection
      ###      
      @collection = new collections.Modules null, {@language}
      @listenTo @collection, "sync", @render      
      
      preloadedData = @$("[data-modules]")
      if preloadedData.length > 0
        data = preloadedData.data "modules"
        @collection.preload_data page, limit, data.modules, data.total_count
        @render()
      else
        @$el.append new exports.Loader
        @collection.pager()
    
    changePage: (e)->
      href = $(e.currentTarget).attr "href"
      if href
        page = href.replace /.*page=([0-9]+).*/, "$1"      
        page = if page then parseInt(page) else 0
      
        delete @context.prev
        delete @context.next
        
        view = @$("ul[data-modules]")
        view.height view.height()
        loader = new exports.Loader().$el
        view.html("").append $("<li />").append(loader)        
                                                 
        @collection.goTo page, {update: true, remove: false}
            
    render:->      
      @context.modules = @collection.toJSON()      
      {totalPages, currentPage} = @collection.info()      
      
      if totalPages > 0      
        @context.pages = []
        for i in [1..totalPages]
          @context.pages.push {text: i, link: i-1, isActive: currentPage+1 is i}                      
            
        @context.prev = (currentPage - 1).toString() if currentPage > 0             
        @context.next = currentPage + 1 if totalPages-1 > currentPage            
      else
        delete @context.pages
                     
      html = views['module/modules'](@context)      
      @$el.html html            
      @$el.attr 'view-id', 'module-list'
      @  
  
  class exports.Languages extends View
    events:
      'click .pagination a' : "changePage"

    initialize:->
      console.log '[__ModuleViewInit__] Init'
      ###
        Context
      ###
      @context.modules_url = modules_url      
      ###
        QS limits      
      ###
      {page, limit} = qs.parse window.location.search
      page  = if page   then parseInt(page)   else 0
      limit = if limit  then parseInt(limit)  else 30
            
      @collection = app.meta.Languages      
      @listenTo @collection, "sync", @render      
      
      ###
        Pager setup
      ###
      preloadedData = @$("[data-languages]")
      if preloadedData.length > 0
        data = preloadedData.data "languages"        
        @collection.preload_data page, limit, data.languages, data.total_count                  
        @render()
      else
        @$el.append new exports.Loader
        @collection.pager()
    
    changePage: (e)->
      href = $(e.currentTarget).attr "href"
      if href
        page = href.replace /.*page=([0-9]+).*/, "$1"      
        page = if page then parseInt(page) else 0
      
        delete @context.prev
        delete @context.next
        
        view = @$("ul[data-languages]")
        view.height view.height()
        loader = new exports.Loader().$el
        view.html("").append $("<li />").append(loader)        
                                                 
        @collection.goTo page, {update: true, remove: false}
      
      
    render:->      
      @context.languages = @collection.toJSON()      
      {totalPages, currentPage} = @collection.info()      
      
      if totalPages > 0
        @context.pages = []
        for i in [1..totalPages]
          @context.pages.push {text: i, link: i-1, isActive: currentPage+1 is i}                      
              
        @context.prev = (currentPage - 1).toString() if currentPage > 0             
        @context.next = currentPage + 1 if totalPages-1 > currentPage            
      else
        delete @context.pages
                     
      html = views['module/index'](@context)      
      @$el.html html            
      @$el.attr 'view-id', 'language-list'
      @  

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)