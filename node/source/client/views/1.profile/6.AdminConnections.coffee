class views.AdminConnections extends View
  events:
    'click #new-connection': "newConnection"

  newConnection: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @connectionform.show()

  updateData: ->
    @context.active_tab = "admin-connections"
    @collection.fetch()

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render

  render: ->
    @context.connections = @collection.toJSON()
    html = tpl['member/admin_connections'](@context)
    @$el.html html

    if @connectionform
      @stopListening @connectionform
      delete @connectionform
    @connectionform = new views.ConnectionForm @context
    @listenTo @connectionform, "success", @updateData

    @