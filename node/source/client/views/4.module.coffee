((exports) ->  
  root = @
  views = @hbt = Handlebars.partials  
  {qs} = root.help
  
  class exports.Repo extends View
  
  class exports.ModuleList extends View
  
  class exports.Languages extends View
    events:
      'click .pagination a' : "changePage"

    initialize:->
      console.log '[__ModuleViewInit__] Init'
      @context.modules_url = "/modules"      
      {page, limit} = qs.parse window.location.search
      page = if page then parseInt(page) else 0
      limit = if limit then parseInt(limit) else 30
            
      @collection = app.meta.Languages
      
      @listenTo app.meta.Languages, "sync", @render      
      
      preloadedData = @$("[data-languages]")
      if preloadedData.length > 0
        data = preloadedData.data "languages"
        @collection.cache[page] = data.languages
        @collection.reset data.languages, {silent: true}
        @collection.bootstrap {totalRecords: parseInt(data.total_count), perPage: limit, currentPage: page}
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
            
      @context.pages = []
      for i in [1..totalPages]
        @context.pages.push {text: i, link: i-1, isActive: currentPage+1 is i}                      
            
      @context.prev = (currentPage - 1).toString() if currentPage > 0             
      @context.next = currentPage + 1 if totalPages-1 > currentPage            
                     
      html = views['module/index'](@context)      
      @$el.html html            
      @$el.attr 'view-id', 'module'
      @  

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)