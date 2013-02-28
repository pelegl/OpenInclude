((exports) ->  
  root = @
  views = @hbt = Handlebars.partials  

  class exports.Module extends View

    initialize:->
      console.log '[__ModuleViewInit__] Init'      
      @render()
      
    render:->  
      html = views['module/index'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'module'
      @  

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)