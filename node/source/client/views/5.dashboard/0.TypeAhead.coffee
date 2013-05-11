views.TypeAhead = Backbone.View.extend
  el : "#typeahead"

  events:
    'click li.suggestion': "select"

  initialize: (context = {}) ->
    @context = context
    @suggestions = new collections.Users
    @cursor = {}

    @listenTo @suggestions, "reset", @render

  position: (element) ->
    offset = $(element).offset()
    width  = $(element).width()
    height = $(element).height()

    @$el.css 'left', offset.left
    @$el.css 'top', offset.top + height

    @context.listener = $(element) unless @context.listener


  select: (e) ->
    value    = $(e.currentTarget).attr("rel")
    oldValue = @context.listener.val()
    newValue = oldValue.substring(0, @cursor.start + 1) + value + oldValue.substring(@cursor.end + 1)

    @context.listener.val(newValue)
    @hide()

  showUser: (cursor) ->
    @base = "/session/list"
    @suggestions.url = "/session/list"
    @available = true
    @cursor.start = cursor
  #@suggestions.fetch()

  showProject: (cursor) ->
    @base = "/project/suggest"
    @suggestions.url = "/project/suggest"
    @available = true
    @cursor.start = cursor
  #@suggestions.fetch()

  showTask: (part) ->
    return

  updateQuery: (part, cursor) ->
    if part.length > 2
      @suggestions.url = "#{@base}/#{part}"
      console.log @suggestions.url

      @xhr.abort() if @xhr
      @xhr = @suggestions.fetch()

      @cursor.end = cursor

  hide: ->
    @$el.hide()
    @available = false

  render: ->
    @context.suggestions = @suggestions.toJSON()
    html = tpl['dashboard/typeahead'](@context)
    @$el.html html
    @$el.show()
    @