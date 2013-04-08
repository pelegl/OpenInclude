class views.AdminConnections extends View
  initialize: (context) ->
    @context = context
    super @context

    @connections = new collections.Connections
    @listenTo @connections, "sync", @render
    @connections.fetch()

  render: ->
    @context.connections = @connections.toJSON()
    html = tpl['member/admin_connections'](@context)
    @$el.html html
    @