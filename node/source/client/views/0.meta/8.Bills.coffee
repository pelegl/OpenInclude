views.BillsDeprecated = Backbone.View.extend
  className: "bills"

  initialize: ->
    @collection = new collections.Bills

    @listenTo @collection, "sync", @render

    @collection.fetch()

  render: ->
    # html
    html  = tpl['member/bills']
      bills:      @collection.toJSON()
      view_bills: app.conf.bills
    # publish data
    help.exchange this, html
    @