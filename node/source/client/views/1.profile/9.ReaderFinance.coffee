class views.ReaderFinance extends View
  filter: (e, render = true) ->
    if e
      e.preventDefault()
      e.stopPropagation()

    if render
      @render()

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render

  render: ->
    @context.finance_reader = @collection.toJSON()
    html = tpl['member/reader_finance'](@context)
    @$el.html html
    options = views.DateRangeObject
    options.element = @$el
    @$('.daterange').daterangepicker options, _.bind(views.DateRangeFunction, @)
    @