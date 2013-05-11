class views.EditProjectForm extends InlineForm
  el: ".main-area"
  view: "dashboard/edit_project"

  success: (model, response, options) ->
    if super model, response, options
      projects.fetch()

  initialize: (context) ->
    @model = context.model
    @model.url = "/project/#{context.projectId}"

    super context