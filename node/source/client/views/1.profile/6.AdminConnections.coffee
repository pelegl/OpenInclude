class views.AdminConnections extends View
  events:
    'click #new-connection': "newConnection"

  newConnection: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @connectionform.show()

  updateData: ->
    @context.active_tab = "admin-connections"
    @connections.fetch()

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

    if @connectionform
      @stopListening @connectionform
      delete @connectionform
    @connectionform = new views.ConnectionForm @context
    @listenTo @connectionform, "success", @updateData

    @