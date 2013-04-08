class views.ReaderRunways extends View
  initialize: (context) ->
    @context = context
    super @context

    @runways_reader = new collections.Connections
    @runways_reader.url = "/api/runway/reader"
    @listenTo @runways_reader, "sync", @render
    @runways_reader.fetch()

  render: ->
    @context.runways_reader = @runways_reader.toJSON()
    html = tpl['member/reader_runway'](@context)
    @$el.html html
    @