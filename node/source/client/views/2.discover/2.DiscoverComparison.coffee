views.DiscoverComparison = Backbone.View.extend
  events:
    "click [data-sort]" : "sortComparison"

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
    _.bindAll this, "render"
    @listenTo @collection, "all", @render

    @context =
      headers : [
        {name: "Project Name", key: "_source.module_name"}
        {name: "Language", key: "_source.language"}
        {name: "Last Commit", key: "_source.pushed_at"}
        {name: "Stars on GitHub", key: "_source.watchers"}
        {name: "Questions on StackOverflow", key: "asked"}
        {name: "Percentage answered", key: "answered"}
      ]
    @render()

  render: ->
    @context.projects = @collection.toJSON()

    html = tpl['discover/compare'](@context)
    @$el.html html
    @$el.attr 'view-id', 'discoverComparison'
    @