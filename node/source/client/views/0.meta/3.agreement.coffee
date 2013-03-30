views.Agreement = Backbone.View.extend
  tagName  : 'div'
  className: 'row-fluid agreementContainer'

  events:
    'submit form' : 'processSubmit'

  show: ->
    @$el.show()

  hide: ->
    @$el.hide()

  processSubmit: (e) ->
    e.preventDefault()
    ###
      Perform async form process
    ###
    isChecked = @$("[name=signed]").prop "checked"
    if isChecked
      @model.save { signed: "signed" }
    else
      ##TODO: handle error

    return false

  signed: ->
    app.navigate app.conf.profile_url, {trigger: true}

  initialize: ->
    @model = new models.Tos
    if $(".agreementContainer").length > 0
      @setElement $(".agreementContainer")
    else
      @render()

    {agreement, action} = @options
    @listenTo @, "init", @niceScroll
    @listenTo @model, "sync", @signed

    @setData agreement, action

  renderData: ->
    output = tpl['member/agreement'](@context)
    @$el.html $(output).unwrap().html()
    @trigger "init"

  setData: (agreement, action)->
    @context =
      agreement_text: agreement
      agreement_signup_action: action
    @model.url = @context.agreement_signup_action
    @renderData()

  niceScroll: ->
    if @$(".agreementText").is(":visible")
      @$(".agreementText").niceScroll()
    @delegateEvents()

  render: ->
    html = tpl['member/agreement'](@context || {})
    @$el = $ html
    @delegateEvents()
    @