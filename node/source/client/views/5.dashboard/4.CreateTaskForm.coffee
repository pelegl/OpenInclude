class views.CreateTaskForm extends InlineForm
  el: "#create-task-inline"
  view: "dashboard/create_task"

  success: (model, response, options) ->
    if super model, response, options
      tasks.fetch()

  initialize: ->
    @model = new models.Task
    @model.url = "/task/#{projectId}"

    super()