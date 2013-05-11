views.DiscoverComparison = Backbone.View.extend
  events:
    "click [data-sort]" : "sortComparison"
    "mouseenter tbody tr" : "fadeIn"
    "mouseleave tbody tr" : "fadeOut"
    "click tbody tr .btn": "remove"

  fadeIn:  (e)-> @fade true, e
  fadeOut: (e)-> @fade false, e

  fade: (className, e)->
    $this  = $(e.currentTarget)
    $fade  = $(".fade", $this)
    action = if className then "addClass" else "removeClass"
    $fade[action]("in")

  remove: (e)->
    $this = $(e.currentTarget).closest("tr")
    id    = $this.data("id")
    model = @collection.get(id)
    # remove
    @collection.remove model

  sortComparison: (e)->
    $this = $(e.currentTarget)
    ###
      sort key
    ###
    key = $this.data("sort")

    ###
      set active on the element in the context, remove active from the previous element
    ###
    index = $this.closest("th").index()
    ###
      get sort direction
    ###
    direction = if @context.headers[index].directionBottom is true then "ASC" else "DESC"

    _.each @context.headers, (v,k)=>
      v.active = false
      v.directionBottom = true

    @context.headers[index].active = true
    @context.headers[index].directionBottom = if direction is "DESC" then true else false


    @collection.sortBy key, direction
    false

  initialize: ->
    _.bindAll this
    @listenTo @collection, "all", @render

    @context =
      headers : [
        {name: "Project Name", key: "module_name"}
        {name: "Language", key: "language"}
        {name: "Last Commit", key: "pushed_at"}
        {name: "Stars on GitHub", key: "watchers"}
        {name: "Questions on StackOverflow", key: "so_questions_asked"}
        {name: "Percentage answered", key: "so_questions_answered"}
      ]
    @render()

  render: ->
    @context.projects = @collection.toJSON()

    html = tpl['discover/compare'](@context)
    @$el.html html
    @$el.attr 'view-id', 'discoverComparison'
    @