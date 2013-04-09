views.Profile = View.extend
  agreement_text: "Do you agree?"

  events:
    'click a.backbone'             : "processAction"
    'click .setupPayment > button' : "update_cc_events"
    'click #new-connection': "newConnection"
    'click #track-time': "trackTime"
    'click #alter-runway': 'alterRunway'

  newConnection: (e) ->
    e.preventDefault()
    e.stopPropagation()

    # TODO: after @render form.show does not work
    if @connectionform
      @stopListening @connectionform
      delete @connectionform
    @connectionform = new views.ConnectionForm @context
    @listenTo @connectionform, "success", @updateData
    @connectionform.show()

  trackTime: (e) ->
    e.preventDefault()
    e.stopPropagation()

    suffix = e.currentTarget.attributes['rel'].value
    limit = parseInt(e.currentTarget.attributes['data-limit'].value)

    @trackForm = new views.TrackTimeForm _.extend(@context, {suffix: suffix, limit: limit, el: "#track-time-inline-#{suffix}"})
    @listenTo @trackForm, "success", @updateData
    @trackForm.show()

  alterRunway: (e) ->
    e.preventDefault()
    e.stopPropagation()

    suffix = e.currentTarget.attributes['rel'].value
    limit = parseInt(e.currentTarget.attributes['data-limit'].value)
    current = parseInt(e.currentTarget.attributes['data-current'].value)

    model = @connections.get(suffix)

    @editForm = new views.AlterRunwayForm _.extend(@context, {limit: limit, model: model, current: current, el: "#alter-runway-inline-#{suffix}"})
    @listenTo @editForm, "success", @updateData
    @editForm.show()

  updateData: (e) ->
    @connections.fetch()
    @runways_reader.fetch()
    @runways_writer.fetch()

  update_cc_events: (e) ->
    @cc.delegateEvents()
    $(e.currentTarget).dropdown 'toggle'

  clearHref: (href)->
    return href.replace "/#{@context.profile_url}", ""

  processAction: (e) ->
    $this  = $(e.currentTarget)
    href   = @clearHref $this.attr "href"

    [action, @get...] = _.without href.split("/"), ""

    @setAction "/#{action}"
    false

  empty: (opts...)->
    @informationBox.children().detach()
    if opts?
      @informationBox.append opts

  setAction: (action)->

    dev           = @clearHref @context.developer_agreement
    merc          = @clearHref @context.merchant_agreement
    trello		    = @clearHref @context.trello_auth_url
    bills         = @clearHref @context.bills


    if action is dev and app.session.get("employee") is false
      ###
        show developer license agreement
      ###
      app.navigate @context.developer_agreement, {trigger: false}
      @empty @agreement.$el

      @agreement.show()
      @agreement.setData @agreement_text, @context.developer_agreement

    else if action is merc and app.session.get("merchant") is false
      ###
        show client license agreement
      ###
      app.navigate @context.merchant_agreement, {trigger: false}

      @empty @agreement.$el

      @agreement.show()
      @agreement.setData @agreement_text, @context.merchant_agreement

      @listenTo @agreement.model, "sync", @setupPayment

    else if action is trello
      ###
        navigate to Trello authorization
      ###
      app.navigate @context.trello_auth_url, {trigger: true}

    else if action is bills
      ###
        navigate to view bills
      ###
      unless @get?.length > 0
        navigateTo = @context.bills
        # show bills
        @empty @bills.$el
      else
        navigateTo = "#{@context.bills}/#{@get.join("/")}"
        # show bill
        [billId] = @get
        if billId?
          billView = new views.Bill {collection: @bills.collection, billId}
          @empty billView.$el
        else
          notFound = new views.NotFound
          @empty notFound.$el


      app.navigate navigateTo, {trigger: false}
    else
      ###
        hide agreement and navigate back to profile
      ###
      @informationBox.children().detach()
      app.navigate @context.profile_url, {trigger: false}

  initialize: (options) ->
    console.log '[__profileView__] Init'
    # get variables - we may use them for actions later on
    @get = options.opts || []

    if options.profile
      @model = new models.User
      @model.url = "/session/profile/#{options.profile}"
      @context.title = "Profile of #{@profile}"
      @context.private = false
    else
      @context.title = "Personal Profile"
      @context.private = true

      @agreement = new views.Agreement
      @cc        = new views.CC
      @bills     = new views.Bills

    @context.from = "none"
    @context.to = "none"

    @listenTo @model, "change", @render
    @listenTo @model, "sync", @render
    @model.fetch()

  render: ->
    console.log "Rendering profile view"

    @context.user = @model.toJSON()

    html = tpl['member/profile'](@context)
    @$el.html html
    @$el.attr 'view-id', 'profile'

    @informationBox = @$ ".informationBox"

    @adminConnections = new views.AdminConnections _.extend(@context, {el: @$("#admin-connections")})
    @adminFinance = new views.AdminFinance _.extend(@context, {el: @$("#admin-finance")})

    @readerRunway = new views.ReaderRunways _.extend(@context, {el: @$("#reader-runway")})
    @readerFinance = new views.ReaderFinance _.extend(@context, {el: @$("#reader-finance")})

    @writerRunway = new views.WriterRunways _.extend(@context, {el: @$("#writer-runway")})
    @writerFinance = new views.WriterFinance _.extend(@context, {el: @$("#writer-finance")})

    # Append CC modal
    if @cc
      @cc.setElement @$(".setupPayment .dropdown-menu")
      @cc.$el.prev().dropdown()

    if @context.private
      @setAction @options.action

    @