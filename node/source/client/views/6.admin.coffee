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
        @action _.last href.split("/")

      false

    empty: (opts...)->
      @informationBox.children().detach()
      if opts?
        @informationBox.append opts


    action: (action)->
      switch action
        when "users_with_stripe"
          @empty @stripeUsers.$el


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
