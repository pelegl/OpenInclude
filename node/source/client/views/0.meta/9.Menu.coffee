views.Menu = Backbone.View.extend
  className: "navigationMenu nav pull-right"

  initialize: ->
    console.log "[__Menu View__] initialized"
    data        = $("[data-menu]").data "menu"

    @collection = new collections.Menu data

    @listenTo app, "route", @navigate

  navigate: ->
    {pathname} = window.location

    # forEach ---
    if pathname.length > 1
      @collection.forEach (link)=>
        testUrl = new RegExp("^#{link.get('url')}.*$")
        isActive = testUrl.test pathname
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