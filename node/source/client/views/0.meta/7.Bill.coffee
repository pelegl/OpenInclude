views.Bill = Backbone.View.extend
  className: "bill"

  initialize:  ->
    _.bindAll this, "initialize"

    {billId} = @options
    bill     = @model || @collection.get billId
    if bill
      @model = bill
      @listenTo @model, "sync", @render
      @render()
    else
      @collection.once "sync",  @initialize

  render: ->
    # html
    html = tpl['member/bill']
      bill: @model.toJSON()
      user: app.session.toJSON()

    help.exchange this, html

    @