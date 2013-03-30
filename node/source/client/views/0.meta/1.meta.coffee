views.MetaView = Backbone.View.extend
  events:
    'submit .navbar-search' : 'searchSubmit'

  searchSubmit: (e)->
    e.preventDefault()

    q = @$("[name=q]").val()
    location = window.location.pathname
    pathname = $(e.currentTarget).attr "action"
    trigger = if location is pathname then false else true

    app.navigate "#{pathname}?q=#{q}", {trigger}
    app.view.fetchSearchData q unless trigger

    false

  initialize: ->
    console.log '[__metaView__] Init'
    @Languages = new collections.Language
    @projects  = new collections.Projects
    @tasks     = new collections.Tasks

    @menu      = new views.Menu el: @$(".navigationMenu")