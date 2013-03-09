((exports) ->  
  root = @
  views = @hbt = Handlebars.partials  
  {qs} = root.help  
  modules_url = "/modules"
  
  ###
    @constructor
    Multi series chart view
  ###  
  class exports.MultiSeries extends @Backbone.View
    
    initialize: (opts={}) ->
      _.bindAll @
      
      @margin = 
        top     : 20
        right   : 80
        bottom  : 30
        left    : 50
      @width = @$el.width() - @margin.right - @margin.left
      @height = 500 - @margin.top - @margin.bottom
      
            
      @x = d3.time.scale().range [0, @width]
      @y = d3.scale.linear().range [@height, 0]
      
      @color = d3.scale.category10()
      
      @xAxis = d3.svg.axis().scale(@x).orient("bottom")
      @yAxis = d3.svg.axis().scale(@y).orient("left")
      
            
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
      
      questions = @color.domain().map (name)=>
        return {
          name: name,
          values: @collection.where {key: name}
        }

            
      @x.domain d3.extent @collection.models, (d)=> return d.x() 
      
      #min = d3.min questions, (c)=> return d3.min c.values, (v)=> return v.y()
      max = d3.max questions, (c)=> return d3.max c.values, (v)=> return v.y()
      
      @y.domain [0, max+300]

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
            .text("Questions");
      
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
              .attr("transform", (d) => return "translate(" + @x(d.value.x()) + "," + @y(d.value.y()) + ")" )
              .attr("x", 3)
              .attr("dy", ".35em")
              .text( (d) => return d.name )
      
      @
      
      
  
  ###
    @constructor
    Repository view 
  ###
  class exports.Repo extends View
    events: {}
    
    initialize: (opts={})->
      {@language, @repo} = opts    
      @model             = new models.Repo {@language, module_name: @repo}
      
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
      ###
        Setup listeners
      ###
      @listenTo @collections.stackOverflow, "sync", @charts.stackOverflow.render      
      ###
        Start fetching data
      ###
      @collections.stackOverflow.fetch()      
      
    initSO: ->
      options = {@language, @repo}
      # create collection and associated chart
      @collections.stackOverflow = so = new collections.StackOverflowQuestions options 
      @charts.stackOverflow      = new exports.MultiSeries {el: @$(".stackQAHistory"), collection: so}         
        
            
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