views.Profile = View.extend
  agreement_text: "Do you agree?"

  events:
    'click a.backbone'             : "processAction"
    'click .setupPayment > button' : "update_cc_events"
    'click a[data-toggle=tab]'     : "makeTabUrl"
    'click #edit_reader'           : "editProfile"
    'click #edit_writer'           : "editWriter"

  editProfile: (e, type = "reader") ->
    e.preventDefault()
    e.stopPropagation()

    @tabs.hide()
    @edit.setType(type)
    @edit.show()

  editWriter: (e) ->
    @editProfile(e, "writer")

  makeTabUrl: (e) ->
    url = e.currentTarget.attributes['href'].value.replace("#", "")
    app.navigate "/profile/#{url}", {trigger: false}

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

      @wizard.setType "writer"
      @wizard.show()
      @tabs.hide()
      @edit.hide()

    else if action is merc and app.session.get("merchant") is false
      ###
        show client license agreement
      ###
      app.navigate @context.merchant_agreement, {trigger: false}

      @wizard.setType "reader"
      @wizard.show()
      @tabs.hide()
      @edit.hide()

    else if action is trello
      ###
        navigate to Trello authorization
      ###
      app.navigate @context.trello_auth_url, {trigger: true}

    else
      ###
        hide agreement and navigate back to profile
      ###
      #@informationBox.children().detach()
      #app.navigate @context.profile_url, {trigger: false}
      unless action is "/null"
        @context.active_tab = action.replace("/", "")
      return

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

    @listenTo @model, "sync", @render

    @model.fetch()

  toggleTabs: ->
    app.navigate @context.profile_url, {trigger: true}
    @tabs.show()

  render: ->
    console.log "Rendering profile view"

    #if @context.private
    #  @setAction @options.action

    @context.user = @model.toJSON()
    @context.userModel = @model

    html = tpl['member/profile'](@context)
    @$el.html html
    @$el.attr 'view-id', 'profile'

    @informationBox = @$ ".informationBox"

    if @context.private

      app.setTitle "Open Include | Admin | Connections"
      user = @model.toJSON()

      unless @context.active_tab
        if user.groups.indexOf("admin") >= 0
          @context.active_tab = "admin-connections"
        if user.groups.indexOf("reader") >= 0
          @context.active_tab = "reader-runway"
        if user.groups.indexOf("writer") >= 0
          @context.active_tab = "writer-runway"

      unless @collections
        @collections = {}
        @collections['admin-connections'] = new collections.Connections
        @collections['admin-finance'] = @collections['admin-connections']
        @collections['admin-blog'] = new collections.BlogPosts

        @collections['reader-runway'] = new collections.Connections
        @collections['reader-runway'].url = "/api/runway/reader"

        @collections['reader-finance'] = new models.Runway
        @collections['reader-finance'].url = "/api/finance/reader"

        @collections['writer-runway'] = new collections.Connections
        @collections['writer-runway'].url = "/api/runway/writer"

        @collections['writer-finance'] = @collections['writer-runway']

      unless @titles
        @titles = {}

        @titles['admin-connections'] = "Open Include | Admin | Connections"
        @titles['admin-finance'] = "Open Include | Admin | Finance"
        @titles['admin-blog'] = "Open Include | Admin | Blog"
        @titles['reader-runway'] = "Open Include | Reader | Runways"
        @titles['reader-finance'] = "Open Include | Reader | Finances"
        @titles['writer-runway'] = "Open Include | Writer | Runways"
        @titles['writer-finance'] = "Open Include | Writer | Finances"


      @adminConnections = new views.AdminConnections _.extend(@context, {el: @$("#admin-connections"), collection: @collections['admin-connections']})
      @adminFinance = new views.AdminFinance _.extend(@context, {el: @$("#admin-finance"), collection: @collections['admin-finance']})
      @adminBlog = new views.Blog _.extend(@context, {el: @$("#admin-blog"), collection: @collections['admin-blog']})

      @readerRunway = new views.ReaderRunways _.extend(@context, {el: @$("#reader-runway"), collection: @collections['reader-runway']})
      @readerFinance = new views.ReaderFinance _.extend(@context, {el: @$("#reader-finance"), collection: @collections['reader-finance']})

      @writerRunway = new views.WriterRunways _.extend(@context, {el: @$("#writer-runway"), collection: @collections['writer-runway']})
      @writerFinance = new views.WriterFinance _.extend(@context, {el: @$("#writer-finance"), collection: @collections['writer-finance']})

      @wizard = new views.Wizard @context
      @listenTo @wizard, "success", @toggleTabs
      @listenTo @wizard, "hidden", @toggleTabs

      @edit = new views.AddSkills @context
      @listenTo @edit, "success", @toggleTabs
      @listenTo @edit, "hidden",  @toggleTabs

      @tabs = @$("#runway-tabs")
      if @context.active_tab
        @collections[@context.active_tab].fetch()

      @setAction @options.action

    # Append CC modal
    if @cc
      @cc.setElement @$(".setupPayment .dropdown-menu")
      @cc.$el.prev().dropdown()

    @$('a[data-toggle="tab"]').on('shown', (e) =>
      id = e.target.attributes['href'].value;
      @collections[id.replace("#", "")].fetch()
      app.setTitle @titles[id.replace("#", "")]
    )

    @