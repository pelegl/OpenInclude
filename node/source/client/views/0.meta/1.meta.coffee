views.MetaView = Backbone.View.extend
  events:
    'submit .navbar-search' : 'searchSubmit'
    'click  [data-shareideas]' : 'shareIdea'


  shareIdea: ->
    app.shareIdeas.toggleShow()
    false

  searchSubmit: (e, action)->
    e.preventDefault() if e?

    q = encodeURIComponent @$("[name=q]").val()
    location = window.location.pathname
    pathname = action or $(e.currentTarget).attr "action"
    trigger = if location is pathname then false else true

    app.navigate "#{pathname}?q=#{q}", {trigger}
    app.view.fetchSearchData q unless trigger

    false

  getQuery: ->
    return @$(".search-query[name=q]").val()

  setQuery: (val) ->
    @$(".search-query[name=q]").val decodeURIComponent(val)

  initialize: ->
    console.log '[__metaView__] Init'
    @Languages = new collections.Language
    @projects  = new collections.Projects
    @tasks     = new collections.Tasks

    @menu      = new views.Menu el: @$(".navigationMenu")

    @placeholder = @$("#view-wrapper")