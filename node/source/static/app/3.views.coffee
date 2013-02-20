((exports) ->  
  root = @
  views = @hbt

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      console.log '[__metaView__] Init'      

  class View extends @Backbone.View
    el:'<section class="contents">'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
      unless opts.prevView?
        opts.el = $('.contents').eq(0)
      else
        $(window).scrollTop 0      
      super opts
  
  
  class exports.Index extends View
    initialize:->
      console.log '[__indexView__] Init'
      @context = 
        title: "Home Page"
        STATIC_URL : app.conf.STATIC_URL
        in_stealth_mode: true
      
      if @options.prevView?
        try @options.prevView.remove(); @options.prevView = null                  
        $(@viewsPlaceholder).html @render().el
      else
        @render()

    render:->  
      html = views['index'](@context)
      @$el.html html
      @$el.attr('view-id', 'index')
      @


#-----------------------------------------------------------------------------------------------------------------------#
).call(this, (window.views = {}))