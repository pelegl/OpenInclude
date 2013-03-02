((exports) ->  
  root = @
  views = @hbt = Handlebars.partials  
  {qs} = root.help
  
  modules_url = "/modules"
  
  class exports.Repo extends View
    events: {}
    
    initialize: (opts)->
      {@language, @repo} = opts    
      @model             = new models.Repo {@language, module_name: @repo}
      
      @context =
        modules_url : modules_url
      
      @listenTo @model, "sync", @render
      
      preloadedData = @$("[data-repo]")
      if preloadedData.length > 0
        @model.set preloadedData.data("repo"), {silent: true}
        @render()
      else
        @model.fetch()
            
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