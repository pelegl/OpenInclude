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
          [userId] = get
          issueBill = new exports.IssueBill
            model: @stripeUsers.collection.get(userId)
          @empty issueBill.$el

      @delegateEvents()

    initialize: ->
      @model = app.session

      @listenTo @model, "sync", @render

      @stripeUsers = new exports.UsersWithStripe

      @render()

    render: ->
      @context.user = @model.toJSON()

      html = views['admin/admin'] @context
      @$el.html html

      @informationBox = @$(".informationBox")

      @action @options.action if @options.action?

      @


  class exports.IssueBill extends @Backbone.View

    initialize: ->
      @render()

    render: ->
      @context.user = @model.toJSON()
      html = views['admin/bill'] @context
      @$el.html html
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
