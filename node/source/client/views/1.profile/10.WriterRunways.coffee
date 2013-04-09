class views.WriterRunways extends View
  initialize: (context) ->
    @context = context
    super @context

    @runways_writer = new collections.Connections
    @runways_writer.url = "/api/runway/writer"
    @listenTo @runways_writer, "sync", @render
    @runways_writer.fetch()

  render: ->
    @context.runways_writer = @runways_writer.toJSON()
    html = tpl['member/writer_runway'](@context)
    @$el.html html
    @