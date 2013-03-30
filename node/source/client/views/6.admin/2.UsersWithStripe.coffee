views.UsersWithStripe = Backbone.View.extend

  initialize: ->
    @collection = new collections.UsersWithStripe
    @context = {}

    @listenTo @collection, "sync", @render

  render: ->
    # context
    @context.users = @collection.toJSON()
    # html
    html = tpl['admin/users_with_stripe'] @context
    @$el.html html
    # output
    @