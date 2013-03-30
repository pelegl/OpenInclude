views.Dashboard = View.extend

  events:
    'click .project-list li a': "editProject"
    'click .project-list li':   "switchProject"

    'click #create-project-button'   : "showProjectForm"
    'click #create-subproject-button': "showSubProjectForm"
    'click #delete-project-button'   : "deleteProject"

    'click #create-task-button': "showTaskForm"

    'click #task-add-comment-button': "showTaskCommentForm"
    'click #task-list li': "openTask"

  clearHref: (href)->
    return href.replace "/#{@context.dashboard_url}", ""

  parsePermissions: (user, project) ->
    @context.canRead = false
    @context.canWrite = false
    @context.canGrant = false
    @context.isOwner = false

    if user._id is project.client.id
      @context.isOwner = true

    for user in project.read
      if user.id is @context.user._id
        @context.canRead = true
        break

    for user in project.write
      if user.id is @context.user._id
        @context.canWrite = true
        break

    for user in project.grant
      if user.id is @context.user._id
        @context.canGrant = true
        break

  openTask: (e) ->
    if typeof e isnt 'object' then @taskId = e
    else
      e.preventDefault()
      @taskId = $(e.currentTarget).attr("rel")

    @task = @tasks.get @taskId

    app.navigate "/dashboard/project/#{@projectId}/task/#{@taskId}", {trigger: false}

    @context.task = @task.toJSON()
    @taskView = new views.Task _.extend @context, el: "#main-area"

  editProject: (e) ->
    e.preventDefault()

    @projectId = e.target.attributes['rel'].value
    @project   = @projects.get @projectId

    @context.projectId = @projectId
    @context.project   = @project.toJSON()
    @context.model     = @project

    @parsePermissions @context.user, @context.project

    editProjectForm = new views.EditProjectForm @context

    editProjectForm.show()

  deleteProject: (e) ->
    e.preventDefault()
    @project.url = "/project/#{@projectId}"
    @project.destroy(
      success: (model, response) =>
        @context.project   = @project   = null
        @context.projectId = @projectId = ""
        @projects.fetch()
    )

  showSubProjectForm: (e) ->
    e.preventDefault()

    @createProject.undelegateEvents() if @createProject?

    @createProject = new views.CreateProjectForm @context
    @createProject.show()

  showProjectForm: (e) ->
    e.preventDefault()
    @context.project = null

    @createProject.undelegateEvents() if @createProject?

    @createProject = new views.CreateProjectForm @context
    @createProject.show()

  showTaskForm: (e) ->
    e.preventDefault()
    if @createTask?
      @createTask.undelegateEvents()
    @createTask = new views.CreateTaskForm @context
    @createTask.show()

  showTaskCommentForm: (e) ->
    e.preventDefault()
    e.stopPropagation()
    createTaskComment = new views.CreateTaskCommentForm _.extend(@context, el: "#task-add-comment-#{@taskId}")
    createTaskComment.show()

  switchProject: (e)->
    if typeof e isnt 'object' then @projectId = e
    else @projectId = e.target.attributes['rel'].value

    @project = @projects.get @projectId

    @context.projectId = @projectId
    @context.project   = @project.toJSON()

    @parsePermissions @context.user, @context.project

    app.navigate "/dashboard/project/#{@projectId}", trigger: false

    @taskId = null

    @tasks.url = "/task/#{@projectId}"
    @tasks.fetch()

  #@render()

  initialize: (params) ->
    console.log '[__dashboardView__] Init'
    # context
    @context.title = "Dashboard"
    @context.user = app.session.toJSON()

    @context.canEdit = (user, project) ->
      return true if user._id is project.client.id
      for _user in project.write
        return true if _user.id is user._id
      false

    @projects = app.meta.projects
    @tasks    = app.meta.tasks

    # binds
    _.bindAll this, "updateProjectList", "updateTaskList", "switchProject", "showTaskCommentForm"

    @listenTo @projects, "sync", @updateProjectList
    @listenTo @tasks,    "sync", @updateTaskList

    @projectId = params.project
    @taskId    = params.task

    @projects.fetch()

  updateProjectList: (collection) ->
    @context.projects = collection.toJSON()
    if @projectId
      if @taskId
        @tasks.url = "/task/#{@projectId}"
        @tasks.fetch()
      else
        return @switchProject @projectId

    @render()

  updateTaskList: (collection) ->
    @context.tasks = collection.toJSON()
    return @openTask(@taskId) if @taskId

    @render()

  setParent: (parent, child) ->
    # TODO: непонятно что здесь происходит ---
    $.get(
      "/project/parent/#{parent}/#{child}"
      (response, status, xhr) =>
        @projects.fetch()
    )

  render: ->
    html = tpl['dashboard/dashboard'](@context)

    @$el.html html
    @$el.attr 'view-id', 'dashboard'

    $(".project-list li").droppable(
      drop: (event, ui) =>
        @setParent(event.target.attributes['rel'].value, ui.draggable.attr("rel"))
    ).draggable(
      containment: "parent"
    )

    unless @projectId or @taskId
      @searchView = new views.Search _.extend(@context, el: "#main-area")

    @