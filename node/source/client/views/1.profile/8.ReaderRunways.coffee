class views.ReaderRunways extends View
  events:
    'click #alter-runway': 'alterRunway'

  alterRunway: (e) ->
    e.preventDefault()
    e.stopPropagation()

    suffix = e.currentTarget.attributes['rel'].value
    limit = parseInt(e.currentTarget.attributes['data-limit'].value)
    current = parseInt(e.currentTarget.attributes['data-current'].value)

    model = @runways_reader.get(suffix)

    @editForm = new views.AlterRunwayForm _.extend(@context, {limit: limit, model: model, current: current, el: "#alter-runway-inline-#{suffix}"})
    @listenTo @editForm, "success", @updateData
    @editForm.show()

  updateData: ->
    @context.active_tab = "reader-runway"
    @runways_reader.fetch()

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