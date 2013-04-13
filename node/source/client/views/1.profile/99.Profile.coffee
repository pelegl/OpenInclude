views.Profile = View.extend
  agreement_text: "Do you agree?"

  events:
    'click a.backbone'             : "processAction"
    'click .setupPayment > button' : "update_cc_events"

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

      if @wizard
        @wizard.destroy()
        delete @wizard
      @wizard = new views.Wizard _.extend @context, {wizard_reader: false}
      @wizard.show()

      #@empty @agreement.$el

      #@agreement.show()
      #@agreement.setData @agreement_text, @context.developer_agreement

    else if action is merc and app.session.get("merchant") is false
      ###
        show client license agreement
      ###
      app.navigate @context.merchant_agreement, {trigger: false}

      if @wizard
        @wizard.destroy()
        delete @wizard
      @wizard = new views.Wizard _.extend @context, {wizard_reader: true}
      @wizard.show()

      #@empty @agreement.$el

      #@agreement.show()
      #@agreement.setData @agreement_text, @context.merchant_agreement

      #@listenTo @agreement.model, "sync", @setupPayment

    else if action is trello
      ###
        navigate to Trello authorization
      ###
      app.navigate @context.trello_auth_url, {trigger: true}

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
      #@bills     = new views.Bills

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

    unless @connections
      @connections = new collections.Connections

    @adminConnections = new views.AdminConnections _.extend(@context, {el: @$("#admin-connections"), collection: @connections})
    @adminFinance = new views.AdminFinance _.extend(@context, {el: @$("#admin-finance"), collection: @connections})

    @connections.fetch()

    @readerRunway = new views.ReaderRunways _.extend(@context, {el: @$("#reader-runway")})
    @readerFinance = new views.ReaderFinance _.extend(@context, {el: @$("#reader-finance")})

    unless @finance_writer
      @finance_writer = new collections.Connections
      @finance_writer.url = "/api/runway/writer"

    @writerRunway = new views.WriterRunways _.extend(@context, {el: @$("#writer-runway"), collection: @finance_writer})
    @writerFinance = new views.WriterFinance _.extend(@context, {el: @$("#writer-finance"), collection: @finance_writer})

    @finance_writer.fetch()

    unless @posts
      @posts = new collections.BlogPosts

    @blog = new views.Blog _.extend(@context, {el: @$("#admin-blog"), collection: @posts})

    @posts.fetch()

    # Append CC modal
    if @cc
      @cc.setElement @$(".setupPayment .dropdown-menu")
      @cc.$el.prev().dropdown()

    if @context.private
      @setAction @options.action

    @