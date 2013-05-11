class views.Task extends View
  events:
    'click #task-check-in': "checkIn"
    'click #task-check-out': "checkOut"
    'click #task-finish': "finish"

  checkIn: (event) ->
    event.preventDefault()
    event.stopPropagation()

    $(event.target).attr("id", "task-check-out")
    $(event.target).html("Check out")

    @currentTime = moment()
    @stop = false
    $.get(
      "/task/time/start/#{taskId}/#{@currentTime.unix()}"
      (result, text, xhr) =>
        if result.success
          setTimeout(_.bind(@timer, @), 1000)
        else
          alert result.error
    )

  checkOut: (event) ->
    event.preventDefault()
    event.stopPropagation()

    $(event.target).attr("id", "task-check-in")
    $(event.target).html("Check in")

    @stop = true
    $.get(
      "/task/time/end/#{taskId}/#{moment().unix()}"
      (result, text, xhr) ->
        unless result.success
          alert result.error
    )

  finish: (event) ->
    @

  timer: ->
    unless @timerEl
      @timerEl = $("#timer")

    diff = moment().diff(@currentTime, "seconds")
    hours = Math.floor(diff / 3600)
    minutes = Math.floor(diff / 60) - hours * 3600
    seconds = Math.floor(diff) - minutes * 60 - hours * 3600

    @timerEl.html "#{hours}:#{minutes}:#{seconds}"

    unless @stop
      setTimeout(_.bind(@timer, @), 1000)

  initialize: (context) ->
    @context = context
    super context
    @render()

  render: ->
    html = tpl['dashboard/task'](@context)
    @$el.html html
    @$el.attr 'view-id', 'dashboard-task'
    @