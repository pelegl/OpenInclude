((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
  

  class exports.MetaView extends @Backbone.View
    events: {}
    
    initialize: ->
      console.log '[__metaView__] Init'      

  class View extends @Backbone.View
    tagName:'section'
    className: 'contents'
    viewsPlaceholder: '#view-wrapper'
    
    constructor:(opts={})->
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
      @context = 
        title: "Home Page"
        STATIC_URL : app.conf.STATIC_URL
        in_stealth_mode: false
            
      @render()

    render:->  
      html = views['index'](@context)
      @$el.html html
      @$el.attr 'view-id', 'index'
      @

  class exports.DiscoverChart extends View
    initialize: ->
      
    render: ->
  
  class exports.Discover extends View
    events: 
      '.search-form submit' : 'fetchSearchData'
    
    initialize:->
      console.log '[__discoverView__] Init'
      
      _.bindAll this, "fetchSearchData", "render", "renderChart"
      
      @chartData = new root.collections.Discovery
      @context = 
        discover_search_action : "/discover"
        STATIC_URL : app.conf.STATIC_URL
      
      qs = root.help.qs.parse(location.search)
      @context.discover_search_query = qs.q if qs.q?
                  
      if qs
        @fetchSearchData qs
      
      @render()  
        
    
    fetchSearchData: (query) ->
      false 

    renderChart: ->
      

    render:->  
      html = views['discover/index'](@context)      
      @$el.html html
      @$el.attr 'view-id', 'discover'
      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, (window.views = {}))