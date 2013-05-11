views.AdminBoard = View.extend
  events:
    'click a.backbone' : "route"

  route: (e) ->
    ###
      Action routing
    ###
    try
      href = $(e.currentTarget).attr("href")
      app.navigate href, {trigger: false}
      segments = href.split("/")
      @action segments[2], segments[3..]

    false

  empty: (opts...)->
    @informationBox.children().detach()
    if opts?
      @informationBox.append opts


  action: (action, get)->
    switch action
      when "users_with_stripe"
        @empty @stripeUsers.$el
      when "issue_bill"
        [username] = get
        model       = @stripeUsers.collection.get username
        @issueBill  = new views.IssueBill {model, collection: @stripeUsers.collection, username}
        @empty @issueBill.$el

      when "bills"
        [billId] = get
        try
          bill = @issuedBills.get billId
          throw "no bill" unless bill
        catch e
          bill = new models.Bill {_id: billId}
          bill.fetch()
        finally
          billView = new views.Bill {model: bill}
          @empty billView.$el

    @delegateEvents()

  initialize: ->
    console.log "[__Admin View__] init"

    @model = app.session

    @listenTo @model, "sync", @render

    @stripeUsers = new views.UsersWithStripe

    @render()

  render: ->
    @context.user = @model.toJSON()

    html = tpl['admin/admin'] @context
    @$el.html html

    @informationBox = @$(".informationBox")

    @action.call this, @options.action, @options.get

    @
