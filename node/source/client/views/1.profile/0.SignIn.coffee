views.SignIn = View.extend
  events:
    'click .welcome-back .thats-not-me': 'switchUser'

  switchUser: ->
    app.session.unload()
    @render()
    false

  initialize: ->
    console.log '[_signInView__] Init'

    @context.title = "Authentication"
    @listenTo app.session, "sync", @render

    @render()

  render: ->
    @context.user  = app.session.user || null

    @$el.html tpl['registration/login'] @context
    @$el.attr 'view-id', 'registration'
    @