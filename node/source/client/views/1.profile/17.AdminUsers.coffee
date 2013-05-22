class views.AdminUsers extends View

  initialize: (context) ->
    super context

    @listenTo @collection, "sync", @render

  render: ->
    @context.users = @collection.toJSON()
    html = tpl['member/admin_userlist'](@context)
    @$el.html html

    @