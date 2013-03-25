((exports) ->
  root = @
  views = @hbt = _.extend({}, dt, Handlebars.partials)

  class exports.AdminBoard extends View
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
          @issueBill  = new exports.IssueBill {model, collection: @stripeUsers.collection, username}
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
            billView = new exports.Bill {model: bill}
            @empty billView.$el

      @delegateEvents()

    initialize: ->
      console.log "[__Admin View__] init"

      @model = app.session

      @listenTo @model, "sync", @render

      @stripeUsers = new exports.UsersWithStripe

      @render()

    render: ->
      @context.user = @model.toJSON()

      html = views['admin/admin'] @context
      @$el.html html

      @informationBox = @$(".informationBox")

      @action.call this, @options.action, @options.get

      @


  class exports.IssueBill extends @Backbone.View
    events:
      "submit form" : "onSubmit"

    onSubmit: (e)->
      e.preventDefault()
      data = Backbone.Syphon.serialize e.currentTarget
      # create a new bill
      @bill.set data
      @bill.save null, {success: @billIssued, error: @billError}

      @$("[type=submit]").addClass("disabled").text("Processing...")

      false

    billIssued: (model, response, options) ->
      @$("[type=submit]").removeClass("disabled").text("Issue Bill")
      # stop listening to the particular bill
      @bill.set response.bill
      # add to the collection
      @issuedBills.add @bill
      # create a new bill
      @prepareForm()

    billError: (model, xhr, options) ->
      console.log "Error", xhr
      # TODO: implement error handling


    validationErrors: (model, errors)->
      stringError = []
      _.each errors, (error)=>
        if typeof error is 'object'
          $input = @$("[name='bill[#{error.name}]']")
          $input.closest(".control-group").addClass "error"
          $input.nextAll().remove()
          $input.after $("<span class='help-inline' />").text(error.msg)
        else
          stringError.push error

      @globalError.text stringError.join("; ")

    clearErrors: ->
      @globalError.empty()
      @$(".control-group.error").removeClass("error").find(".help-inline").remove()

    prepareForm: ->
      @stopListening @bill if @bill?
      # create a bill
      @bill = new models.Bill
        bill :
          user: @model.get("_id")

      # listen Handlers
      @listenTo @bill, "invalid", @validationErrors
      @listenTo @bill, "change" , @clearErrors

      form = @$("form")
      if form.length > 0
        Backbone.Syphon.deserialize form[0], @bill.toJSON()
        $("#billAmount", form).focus()


    initialize: ->
      console.log "[__IssueBill View__] init"

      @context =
        bills_action : app.conf.bills
        bills: []

      _.bindAll this, "billIssued"

      return @listIssuedBills() if @model?

      @collection.once "sync", =>
        @model = @collection.get @options.username
        @listIssuedBills()

    listIssuedBills: ->
      ###
        List bills for the specified user
      ###
      @issuedBills = new collections.Bills [], {user: @model}
      @issuedBills.fetch()

      @listenTo @issuedBills, "sync", @renderBills
      @listenTo @issuedBills, "add" , @renderBills

      @prepareForm()
      @render()

    renderBills: ->
      # prepare html
      html = views['bills/table']
        bills: @issuedBills.toJSON()
        view_bills: "/admin/bills"
      # insert
      @$(".bills").html html

    render: ->
      @context.user = @model.toJSON() if @model?
      html = views['admin/bill'] @context
      @$el.html html
      # set pointers
      @globalError = @$("legend .error")

      @


  class exports.UsersWithStripe extends @Backbone.View

    initialize: ->
      @collection = new collections.UsersWithStripe
      @context = {}

      @listenTo @collection, "sync", @render

    render: ->
      # context
      @context.users = @collection.toJSON()
      # html
      html = views['admin/users_with_stripe'] @context
      @$el.html html
      # output
      @




#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)
