views.HowTo = View.extend

  initialize:->
    console.log '[__HowToView__] Init'
    app.setTitle "OpenInclude | How To"
    @render()

  render:->
    html = tpl['how-to'](@context)
    @$el.html html
    @$el.attr 'view-id', 'how-to'
    @
