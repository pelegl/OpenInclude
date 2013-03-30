class views.CreateTaskCommentForm extends InlineForm
  view: "dashboard/create_task_comment"

  success: (model, response, options) ->
    if super model, response, options
      tasks.fetch()

  initialize: (context) ->
    @model = new models.TaskComment
    @model.url = "/task/comment/#{taskId}"

    super context