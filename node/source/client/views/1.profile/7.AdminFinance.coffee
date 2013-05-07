class views.AdminFinance extends View
  events:
    'click #admin-filter': 'filter'
    'click #chaaaaaarge': 'onwardsMyMightyStallion'
    'switch-change #toggle-paid': 'togglePaid'

  onwardsMyMightyStallion: (e) ->
    e.preventDefault()

    $this         = $(e.currentTarget)
    connectionId  = $this.data("connection")
    billId        = $this.data("bill")

    connection = @collection.get connectionId
    bill       = connection.get_bill billId

    # process charge
    bill.charge @renderBills, alert


  togglePaid: (e, data) ->
    @context.show_paid = data.value
    @renderBills()

  filter: (e, render = true) ->
    if e
      e.preventDefault()
      e.stopPropagation()

    @context.admin_from = @$("#admin_from").text() or "none"
    @context.admin_to = @$("#admin_to").text() or "none"
    @context.admin_start = @datepicker.startDate
    @context.admin_end = @datepicker.endDate
    @context.active_tab = "admin-finance"
    @context.admin_filter = @$("#admin_filter").text()
    if render
      @render()

    data = "Writer,Reader,Pending,Paid\n"
    _.each(@context.connections, (finance) =>
      charge = 0
      paid = false
      _.each(finance.runways, (runway) =>
        m = moment(runway.date)
        f = moment(@context.admin_from)
        t = moment(@context.admin_to)
        if @context.admin_from != "none" && @context.admin_to != "none" && !((m.isAfter(f, 'day') || m.isSame(f, 'day')) && (m.isBefore(t, 'day')) || m.isSame(t, 'day'))
          return
        worked = parseInt(runway.worked)
        price = worked * (runway.charged + runway.charged * runway.fee / 100)
        charge += price
        if runway.paid
          paid = true
      )

      if paid
        pending = 0
      else
        pending = charge
        charge = 0
      unless pending is 0 and charge is 0
        data += "#{finance.writer.name},#{finance.reader.name},#{pending},#{charge}\n"
    )

    window.URL = window.webkitURL || window.URL;
    a = document.getElementById "admin-csv"

    return unless a?

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

    _.bindAll this

    @listenTo @collection, "sync", @render
    @context.admin_from = "none"
    @context.admin_to = "none"

  renderBills: ->
    @context.connections = @collection.toJSON()

    console.log @collection

    html = tpl['member/admin_finance'](@context)
    exchange = $("<div />").append(html).find(".table").html()
    @$(".table").html exchange
    @

  render: ->
    @context.connections = @collection.toJSON()
    html = tpl['member/admin_finance'](@context)
    @$el.html html

    options = views.DateRangeObject
    options.element = @$el
    @datepicker = @$('.daterange').daterangepicker _.extend(options, {startDate: @context.admin_start, endDate: @context.admin_end}), _.bind(views.DateRangeFunction, @)

    @$(".switch").bootstrapSwitch()

    @filter(null, false)
    @

