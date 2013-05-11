views.Index = View.extend
  initialize:->
    console.log '[__indexView__] Init'
    @context.title = "Open Include | Open Source Discovery and Integration"
    @render()

  render:->
    app.setTitle @context.title

    html = tpl['index'](@context, null, @context.partials)
    @$el.html html
    @$el.attr 'view-id', 'index'
    @