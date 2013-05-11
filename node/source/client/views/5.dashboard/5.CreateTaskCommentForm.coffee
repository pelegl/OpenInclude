class views.CreateTaskCommentForm extends InlineForm
  view: "dashboard/create_task_comment"

  success: (model, response, options) ->
    app.meta.tasks.fetch() if super model, response, options


  initialize: (context) ->
    @model = new models.TaskComment
    @model.url = "/task/comment/#{context.taskId}"

    super context