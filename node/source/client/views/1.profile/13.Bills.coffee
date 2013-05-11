class views.Bills extends View
  initialize: (context) ->
    super context

    @collection = new collections.Bills
    @listenTo @collection, "sync", @render
    @collection.fetch()

  render: ->
    @context.bills = @collection.toJSON()
    html = tpl['bills/table'](@context)
    @$el.html html
    @