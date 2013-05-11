views.DiscoverFilter = Backbone.View.extend
  events:
    "change input[type=checkbox]" : "filterResults"
    "click [data-reset]" : "resetFilter"
    "click [data-clear]" : "clearFilter"

  initialize: ->
    _.bindAll this, "render"

    @context =
      filters: [
        {name: "Language", key: "languageFilters"}
      ]

    @listenTo @collection, "reset", @render
    @listenTo @collection, "reset", @resetFilter

    @render()

  clearFilter: (e)->
    @$(".filterBox").find("input[type=checkbox]").prop "checked", false
    @collection.filters = {}
    @collection.trigger "filter"
    false


  resetFilter: (e)->

    filters = {}
    @$(".filterBox").find("input[type=checkbox]").prop("checked", true).each ->
      languageName          = $(this).val()
      filters[languageName] = true

    @collection.filters = filters
    @collection.trigger "filter"
    false

  filterResults: (e)->
    $this = $(e.currentTarget)
    languageName = $this.val()

    if $this.is(":checked")
      @collection.filters[languageName] = true
    else
      delete @collection.filters[languageName]

    @collection.trigger "filter"

  render: ->
    @context.filters[0].languages = @collection.languageList()
    html = tpl['discover/filter'](@context)
    @$el.html html
    @$el.attr 'view-id', 'discoverFilter'
    @