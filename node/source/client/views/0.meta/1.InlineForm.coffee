class InlineForm extends Backbone.View
  events:
    'submit form': "submit"
    'click button[type=submit]': "preventPropagation"
    'click .close-inline': "hideButton"
    'keypress textarea.typeahead': "typeahead"

  preventPropagation: (event) ->
    event.stopPropagation()

  constructor: (opts={}) ->
    opts.el = $el if @el and ($el = $(@el)).length > 0
    super opts

  initialize: (context = {}) ->
    @context = _.extend {}, context, app.conf

    _.bindAll this
    _.extend @, Backbone.Events

    @listenTo this, "fail", @fail

    @tah = new views.TypeAhead @context
    @buf = ""

  typeahead: (event) ->
    code = event.which or event.keyCode or event.charCode
    char = String.fromCharCode code

    @tah.position(event.target)

    switch char
      when '@'
        @buf = ''
        @tah.showUser(event.target.selectionStart)
      when '#'
        @buf = ''
        @tah.showTask(event.target.selectionStart)
      when '+'
        @buf = ''
        @tah.showProject(event.target.selectionStart)
      when ' '
        @buf = ''
        @tah.hide()
        return true
      else
        if code is 8
          # backspace
          @buf = @buf.substring(0, @buf.length - 1)
          return true

        if event.charCode is 0
          return true
        if @tah.available
          @buf += char
        if @buf.length > 0
          @tah.updateQuery @buf, event.target.selectionEnd

  fail: ->
    submit = @$("[type=submit]")
    submit.removeClass("disabled").text submit.data("app-text")

  submit: (event, data = null) ->
    event.preventDefault()

    unless data
      data = Backbone.Syphon.serialize event.currentTarget

    unless @validate(data)
      alert @validation
      return

    submit = @$("[type=submit]")
    submit.data "app-text", submit.text()
    submit.addClass("disabled").text("Updating information...")

    @model.save data, {@success, error: @success }

    false

  validate: (data) ->
    true

  success: (model, response, options) ->
    if response.success is true
      @hide()
      @trigger "success"
      return true
    else
      #console.log(response)
      alert "An error occured #{response.err.name}"
      @trigger "fail"
      return false

  show: ->
    @render()
    @$el.show()
    @$("form input:first-child").focus()

  hideButton: (event) ->
    @hide(event)
    @trigger "hidden"

  hide: (event) ->
    if event
      event.preventDefault()
      event.stopPropagation()
    @$el.empty()
    @$el.hide()

  render: ->
    @$el.hide().html tpl[@view](@context)
    @