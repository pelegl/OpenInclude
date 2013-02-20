((exports) ->  
  root = @

  class exports.MetaView extends @Backbone.View
    events:      
    
    initialize: ->
      console.log '[__metaView__] Init'      

  class View extends @Backbone.View
    el:'<span class="view-wrapper">'
    viewsPlaceholder: '#view-placeholder'
    
    constructor:(opts={})->
      unless opts.prevView?
        opts.el = $('.view-wrapper').eq(0)
      else
        $(window).scrollTop 0      
      super opts
  
  
  class exports.Index extends View

    initialize:->      
      if @options.prevView?
        try @options.prevView.remove(); @options.prevView = null                  
        $(@viewsPlaceholder).html @render().el

    render:->      
      @$el.html "test"
      @$el.attr('view-id', 'index')
      @


#-----------------------------------------------------------------------------------------------------------------------#
).call(this, (window.views = {}))