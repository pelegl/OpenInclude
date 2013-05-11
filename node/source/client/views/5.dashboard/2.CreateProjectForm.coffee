class views.CreateProjectForm extends InlineForm
  el: "#create-project-inline"
  view: "dashboard/create_project"

  success: (model, response, options) ->
    if super model, response, options
      projectId = response.id
      projects.fetch()

  initialize: (context) ->
    @model = new models.Project

    super context