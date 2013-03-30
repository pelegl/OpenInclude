views.CC = Backbone.View.extend
  className: "dropdown-menu"

  events:
    'click  form' : "stopPropagation"
    'submit form' : "updateCardData"

  stopPropagation: (e) ->
    e.stopPropagation()

  updateCardData: (e) ->
    e.preventDefault()
    data = Backbone.Syphon.serialize e.currentTarget

    @$("[type=submit]").addClass("disabled").text("Updating information...")

    @model.set data
    @model.save null, {success: @processUpdate, error: @processUpdate}

    return false

  processUpdate: (model, response, options) ->
    if response.success is true
      app.session.set {has_stripe: true}
    else
      #TODO: do error handling

  initialize: ->
    @model     = new models.CreditCard
    @model.url = app.conf.update_credit_card

    _.bindAll @, "processUpdate"
    @context  = _.extend {}, app.conf

    $el  = $(".setupPayment .dropdown-menu")
    if $el.length > 0
      @setElement $el
    else
      @render()

  render: ->
    html = tpl['member/credit_card'](@context)
    @$el.html $(html).html()
    @