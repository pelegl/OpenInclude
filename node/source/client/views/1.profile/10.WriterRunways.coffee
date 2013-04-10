class views.WriterRunways extends View
  events:
    'click #track-time': "trackTime"

  trackTime: (e) ->
    e.preventDefault()
    e.stopPropagation()

    suffix = e.currentTarget.attributes['rel'].value
    limit = parseInt(e.currentTarget.attributes['data-limit'].value)

    @trackForm = new views.TrackTimeForm _.extend(@context, {suffix: suffix, limit: limit, el: "#track-time-inline-#{suffix}"})
    @listenTo @trackForm, "success", @updateData
    @trackForm.show()

  updateData: ->
    @context.active_tab = "writer-runway"
    @runways_writer.fetch()

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