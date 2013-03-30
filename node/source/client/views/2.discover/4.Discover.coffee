views.Discover = View.extend
  events:
    'submit .search-form' : 'searchSubmit'

  initialize:->
    console.log '[__discoverView__] Init'

    _.bindAll this, "fetchSearchData", "render", "searchSubmit"


    qs = help.qs.parse(location.search)
    @context.discover_search_query = decodeURI(qs.q) if qs.q?
    @context.discover_search_action = "/discover"

    @render()

    ###
      initializing chart
    ###
    @chartData      = new collections.Discovery
    @comparisonData = new collections.DiscoveryComparison
    @filter         = new views.DiscoverFilter { el: @$(".filter"), collection: @chartData }
    @chart          = new views.DiscoverChart { el: @$("#searchChart"), collection: @chartData }
    @comparison     = new views.DiscoverComparison { el: @$("#moduleComparison"), collection: @comparisonData }

    if qs.q? then @fetchSearchData qs.q

    @listenTo @chartData, "reset", @populateComparison

  searchSubmit: (e)->
    e.preventDefault()
    q = @$("[name=q]").val()
    {pathname} = window.location
    app.navigate "#{pathname}?q=#{q}", {trigger: false}
    @fetchSearchData q

  fetchSearchData: (query) ->
    @chart.collection.fetch query

  populateComparison: ->
    @comparisonData.reset @chartData.getBestMatch()

  render:->
    html = tpl['discover/index'](@context)
    @$el.html html
    @$el.attr 'view-id', 'discover'
    @