views.Index = View.extend
  initialize:->
    console.log '[__indexView__] Init'
    @context.title = "Home Page"
    @render()

  render:->
    html = tpl['index'](@context, null, @context.partials)
    @$el.html html
    @$el.attr 'view-id', 'index'
    @