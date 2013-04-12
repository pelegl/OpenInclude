class views.Wizard extends InlineForm
  el: "#tos"
  view: "member/wizard"

  events:
    'click .next': "dostep"
    'click .prev': "dostep"

    'click .close-inline': "hide"
    'submit form': 'submit'

  dostep: (e) ->
    e.preventDefault()
    e.stopPropagation()

    step = e.currentTarget.attributes['rel'].value
    stepDiv = document.getElementById step
    if stepDiv
      $(@step).hide()
      @step = stepDiv
      $(@step).show()

      @$("#wizard-nav li").css "background-color", "inherit"
      @$("#wizard-nav li[rel=#{step}]").css "background-color", "white"

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