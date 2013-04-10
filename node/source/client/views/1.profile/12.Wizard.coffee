class views.Wizard extends InlineForm
  el: "#tos"
  view: "member/wizard"

  events:
    'click .next': "nextStep"
    'click .prev': "prevStep"
    'click .close-inline': "hide"
    'submit form': 'submit'

  nextStep: (e) ->
    e.preventDefault()
    e.stopPropagation()

    step = e.currentTarget.attributes['rel'].value
    stepDiv = document.getElementById step
    if stepDiv
      $(@step).hide()
      @step = stepDiv
      $(@step).show()

  prevStep: (e) ->
    e.preventDefault()
    e.stopPropagation()

  initialize: (context) ->
    if context.wizard_reader
      @model     = new models.CreditCard
      @model.url = app.conf.update_credit_card
    else
      @model = new models.CreditCard
      @model.url = "/profile/update_paypal"

    super context

    @render()

    @step = document.getElementById "step-1"

  destroy: ->
    @stopListening()
    @$el.empty()