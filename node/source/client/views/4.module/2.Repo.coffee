views.Repo = View.extend
  events:
    'click [data-action=star]' : "setBookmark"

  setBookmark: ->
    $this = $(e.currentTarget)

  initialize: (opts={})->
    {@language, repo}   = opts
    try [@owner, @repo] = decodeURI(repo).split "|"

    @model             = new models.Repo {@language, module_name: @repo, @owner}

    ###
      context
    ###
    @context =   {modules_url: "/#{app.conf.modules_url}"}

    ###
      events
    ###
    _.bindAll @

    @listenTo @model, "sync", @render
    @listenTo @model, "sync", @initCharts

    @collections = {}
    @charts      = {}
    ###
      setup render and load data
    ###
    preloadedData = @$("[data-repo]")
    if preloadedData.length > 0
      @model.set preloadedData.data("repo"), {silent: true}
      @render()
      @initCharts()
    else
      @model.fetch()

  initCharts: ->
    ###
      inits
    ###
    @initSO()
    @initGE()
    ###
      Setup listeners
    ###
    @listenTo @collections.stackOverflow, "sync", @charts.stackOverflow.renderChart
    @listenTo @collections.githubEvents,  "sync", @charts.githubCommits.renderChart
    @listenTo @collections.githubEvents,  "sync", @charts.githubWatchers.renderChart
    ###
      Start fetching data
    ###
    @collections.stackOverflow.fetch(
      beforeSend: =>
        @charts.stackOverflow.progress 0, 100
      success: (a, r) =>
        @charts.stackOverflow.stopProgress()
        @charts.stackOverflow.progress 100, 100
    )
    @collections.githubEvents.fetch(
      beforeSend: =>
        @charts.githubCommits.progress 0, 100
        @charts.githubWatchers.progress 0, 100
      success: (a, r) =>
        @charts.githubCommits.stopProgress()
        @charts.githubCommits.progress 100, 100
        @charts.githubWatchers.stopProgress()
        @charts.githubWatchers.progress 100, 100
    )

  initSO: ->
    options = {@language, @owner, @repo}
    # create collection and associated chart
    @collections.stackOverflow = so = new collections.StackOverflowQuestions options
    @charts.stackOverflow      = new views.MultiSeries {el: @$(".stackQAHistory"), collection: so}

  # Github Events
  initGE: ->
    options = {@language, @owner, @repo}
    # create collection and associated chart
    @collections.githubEvents = ge = new collections.GithubEvents options

    @charts.githubCommits      = new views.Series {el: @$(".commitHistory"), collection: ge, types: ["PushEvent"] , title: "Commits over time"}
    @charts.githubWatchers     = new views.Series {el: @$(".starsHistory"),  collection: ge, types: ["WatchEvent"], title: "Watchers over time"}

  render: ->
    console.log "[__ render repo view __]"
    @context.module = @model.toJSON()

    html = tpl['module/view'](@context)
    @$el.html html
    @$el.attr 'view-id', 'repo'
    @