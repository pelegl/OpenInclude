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

    _.extend @, Backbone.Events

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

  submit: (event, data = null) ->
    console.log "submit form", this, event

    event.preventDefault()
    event.stopPropagation()

    unless data
      data = Backbone.Syphon.serialize event.currentTarget

    unless @validate(data)
      alert @validation
      return

    @$("[type=submit]").addClass("disabled").text("Updating information...")
    @model.save data, {success: _.bind(@success, @), error: _.bind(@success, @)}

    false

  validate: (data) ->
    true

  success: (model, response, options) ->
    if response.success is true
      @hide()
      @trigger "success"
      return true
    else
      console.log(response)
      alert "An error occured"
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