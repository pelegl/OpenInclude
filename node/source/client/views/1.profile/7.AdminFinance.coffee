class views.AdminFinance extends View
  events:
    'click #admin-filter': 'filterAdmin'

  filterAdmin: (e) ->
    e.preventDefault()
    e.stopPropagation()

    @context.admin_from = @$("#admin_from").text() or "none"
    @context.admin_to = @$("#admin_to").text() or "none"
    @context.active_tab = "admin-finance"
    @context.admin_filter = @$("#admin_filter").text()
    @render()

  initialize: (context) ->
    @context = context
    super @context

    @connections = new collections.Connections
    @listenTo @connections, "sync", @render
    @connections.fetch()

  render: ->
    @context.connections = @connections.toJSON()
    html = tpl['member/admin_finance'](@context)
    @$el.html html
    @$('.daterange').daterangepicker views.DateRangeObject, views.DateRangeFunction
    @