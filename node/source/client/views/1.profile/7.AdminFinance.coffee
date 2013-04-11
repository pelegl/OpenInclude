class views.AdminFinance extends View
  events:
    'click #admin-filter': 'filter'
    'click #chaaaaaarge': 'onwardsMyMightyStallion'

  onwardsMyMightyStallion: (e) ->
    e.preventDefault()
    e.stopPropagation()

    id = e.currentTarget.attributes['rel'].value

    $.ajax(
      url: '/api/payment/charge'
      type: 'post'
      data:
        id: id
      context: @
      success: (data, status, xhr) ->
        @collection.fetch()
      error: (xhr, status, error) ->
        alert xhr.responseText
    )

  filter: (e) ->
    if e
      e.preventDefault()
      e.stopPropagation()

    @context.admin_from = @$("#admin_from").text() or "none"
    @context.admin_to = @$("#admin_to").text() or "none"
    @context.active_tab = "admin-finance"
    @context.admin_filter = @$("#admin_filter").text()
    @render()

    data = "\"Writer\";\"Reader\";\"Pending\"\n"
    _.each(@context.connections, (finance) =>
      charge = 0
      _.each(finance.runways, (runway) =>
        m = moment(runway.date)
        f = moment(@context.from)
        t = moment(@context.to)
        if @context.from != "none" && @context.to != "none" && !((m.isAfter(f, 'day') || m.isSame(f, 'day')) && (m.isBefore(t, 'day')) || m.isSame(t, 'day'))
          return
        worked = parseInt(runway.worked);
        price = worked * (runway.charged + runway.charged * runway.fee / 100);
        charge += price;
      )

      if charge > 0
        data += "\"#{finance.writer.name}\";\"#{finance.reader.name}\";\"#{charge}\"\n"
    )

    window.URL = window.webkitURL || window.URL;
    a = document.getElementById "admin-csv"

    if a.href
      window.URL.revokeObjectURL(a.href)
    unless a.dataset?
      a.dataset = {}

    bb = new Blob([data], {type: "text/csv"});

    a.download = "Report for #{@context.admin_filter}.csv"
    a.href = window.URL.createObjectURL(bb)
    a.dataset.downloadurl = ["text/csv", a.download, a.href].join(':')

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render
    @context.admin_from = "none"
    @context.admin_to = "none"

  render: ->
    @context.connections = @collection.toJSON()
    html = tpl['member/admin_finance'](@context)
    @$el.html html
    @$('.daterange').daterangepicker views.DateRangeObject, _.bind(views.DateRangeFunction, @)
    @