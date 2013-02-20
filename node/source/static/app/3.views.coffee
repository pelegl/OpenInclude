((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  

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
        in_stealth_mode: false
      
      if @options.prevView?
        try @options.prevView.remove(); @options.prevView = null                  
        $(@viewsPlaceholder).html @render().el
      else
        @render()

    render:->  
      html = views['index'](@context)
      @$el.html html
      @$el.attr 'view-id', 'index'
      @

  class exports.DiscoverChart extends View
    
  
  class exports.Discover extends View
    events: 
      '.search-form submit' : 'fetchSearchData'
    
    initialize:->
      console.log '[__discoverView__] Init'
      
      _.bindAll this, "fetchSearchData", "render", "renderChart"
      
      @context = 
        discover_search_action : "/discover"
        STATIC_URL : app.conf.STATIC_URL
      
      qs = root.help.qs.parse(location.search)
      @context.discover_search_query = qs.q if qs.q?
      
      if @options.prevView?
        try @options.prevView.remove(); @options.prevView = null                  
        $(@viewsPlaceholder).html @render().el
      else
        @render()
        
    fetchSearchData: ->
      
      

    renderChart: ->
      

    render:->  
      html = views['discover/index'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discover'
      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, (window.views = {}))