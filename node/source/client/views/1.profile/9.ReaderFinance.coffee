class views.ReaderFinance extends View
  initialize: (context) ->
    super context

    @finance_reader = new models.Runway
    @finance_reader.url = "/api/finance/reader"
    @listenTo @finance_reader, "sync", @render
    @finance_reader.fetch()

  render: ->
    @context.finance_reader = @finance_reader.toJSON()
    html = tpl['member/reader_finance'](@context)
    @$el.html html
    @$('.daterange').daterangepicker views.DateRangeObject, views.DateRangeFunction
    @