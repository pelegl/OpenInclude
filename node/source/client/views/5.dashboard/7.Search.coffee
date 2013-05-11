class views.Search extends View
  events:
    'submit form': "submit"
    'click button[type=submit]': "preventPropagation"

  preventPropagation: (event) ->
    event.stopPropagation()

  submit: (event) ->
    event.preventDefault()
    event.stopPropagation()

    data = Backbone.Syphon.serialize event.currentTarget
    @tasks = new collections.Tasks
    @listenTo @tasks, "reset", @renderResult

    unless data.search
      data.search = "-"

    unless data.from
      data.from = "none"
    else
      data.from = moment(data.from).unix()

    unless data.to
      data.to = "none"
    else
      data.to = moment(data.to).unix()

    @tasks.url = "/task/search/#{data.search}/#{data.from}/#{data.to}"
    @tasks.fetch()

  initialize: (context) ->
    @context = context
    super context
    @render()

  renderResult: (collection) ->
    _tasks = []
    collection.each((item) ->
      _tasks.push item.toJSON())
    @context.tasks = _tasks
    @render()

  render: ->
    html = tpl['dashboard/search'](@context)
    @$el.html html
    @$el.attr 'view-id', 'dashboard-search'

    from = @$el.find("input[name=from]")
    to = @$el.find("input[name=to]")

    from.datepicker(
      onClose: (selectedDate) ->
        to.datepicker("option", "minDate", selectedDate)
    )

    to.datepicker(
      onClose: (selectedDate) ->
        from.datepicker("option", "maxDate", selectedDate)
    )

    @