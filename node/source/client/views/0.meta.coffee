((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      console.log '[__metaView__] Init'      


  root.View = class View extends @Backbone.View
    tagName:'section'
    className: 'contents'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
      @context =
        STATIC_URL : app.conf.STATIC_URL
        in_stealth_mode: false
      
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
      @context.title = "Home Page" 
      @render()

    render:->  
      html = views['index'](@context)
      @$el.html html
      @$el.attr 'view-id', 'index'
      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views = {})