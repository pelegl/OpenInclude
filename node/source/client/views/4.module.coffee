((exports) ->  
  root = @
  views = @hbt = Handlebars.partials  
  {qs} = root.help
  
  class exports.Module extends View

    initialize:->
      console.log '[__ModuleViewInit__] Init'
      
      {page, limit} = qs.parse window.location.search
      page = if page then parseInt(page) else 0
      limit = if limit then parseInt(limit) else 30
            
      @collection = app.meta.Languages
      
      @listenTo app.meta.Languages, "reset", @render
      @listenTo app.meta.Languages, "change", @render
      
      preloadedData = @$("[data-languages]")
      if preloadedData.length > 0
        data = preloadedData.data "languages"
        @collection.reset data.languages, {silent: true}
        @collection.bootstrap {totalRecords: parseInt(data.total_count), perPage: limit, currentPage: page}
        @render()        
      else
        @$el.append new exports.Loader
        @collection.pager()
      
      
    render:->
      @context.languages = @collection.toJSON()
          
      html = views['module/index'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'module'
      @  

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)