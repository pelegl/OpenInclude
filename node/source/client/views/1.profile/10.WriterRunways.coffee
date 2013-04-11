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
    @collection.fetch()

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render

  render: ->
    @context.runways_writer = @collection.toJSON()
    html = tpl['member/writer_runway'](@context)
    @$el.html html
    @