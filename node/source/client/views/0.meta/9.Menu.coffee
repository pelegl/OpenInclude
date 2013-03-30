views.Menu = Backbone.View.extend
  className: "navigationMenu nav pull-right"

  initialize: ->
    console.log "[__Menu View__] initialized"
    data        = $("[data-menu]").data "menu"

    @collection = new collections.Menu data

    @listenTo app, "route", @navigate

  navigate: ->
    {parse}    = help.qs
    {pathname} = window.location
    # building test
    testUrl = new RegExp("^#{pathname}.*$")
    # forEach ---
    if pathname.length > 1
      @collection.forEach (link)=>
        isActive = testUrl.test link.get("url")
        link.set {isActive}
    else
      @collection.forEach (link) => link.set {isActive: false}
    # render ---
    @render()



  render: ->
    context =
      _menu: @collection.toJSON()
    view = tpl['menu'](context)
    @$el.html view
    @