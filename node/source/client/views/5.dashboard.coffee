((exports) ->
  root = @
  views = @hbt = _.extend({}, dt, Handlebars.partials)

  projects = new collections.Projects
  tasks = new collections.Tasks
  projectId = ""
  project = null
  taskId = ""
  task = null
  taskEl = null

  class Users extends @Backbone.Collection
    model : models.User
    url : "/session/list"

  class TypeAhead extends @Backbone.View
    el : "#typeahead"

    events:
      'click li.suggestion': "select"

    initialize: (context = {}) ->
      @context = context
      @suggestions = new Users

      @listenTo @suggestions, "reset", @render

    position: (element) ->
      offset = $(element).offset()
      width = $(element).width()
      height = $(element).height()

      @$el.css 'left', offset.left + width / 2
      @$el.css 'top', offset.top + height / 2

      if not @context.listener
        @context.listener = element

    select: (event) ->
      value = $(event.target).attr("rel")
      value = $(@context.listener).val() + value + " "
      $(@context.listener).val(value)
      @hide()

    showUser: () ->
      @base = "/session/list"
      @suggestions.url = "/session/list"
      @suggestions.fetch()

    showProject: () ->
      @base = "project/suggest"
      @suggestions.url = "/project/suggest"
      @suggestions.fetch()

    showTask: (part) ->
      return

    updateQuery: (part) ->
      @suggestions.url = "#{@base}/#{part}"
      console.log @suggestions.url
      @suggestions.fetch()

    hide: ->
      @$el.hide()
      @available = false

    render: ->
      @context.suggestions = @suggestions.toJSON()
      html = views['dashboard/typeahead'](@context)
      @$el.html html
      @$el.show()
      @available = true
      @

  class InlineForm extends @Backbone.View
    events:
      'submit form': "submit"
      'click button[type=submit]': "preventPropagation"
      'click .close-inline': "hide"
      'keypress textarea.typeahead': "typeahead"

    preventPropagation: (event) ->
      event.stopPropagation()

    initialize: (context = {}) ->
      @context = _.extend {}, context, app.conf
      super context

      @tah = new TypeAhead @context
      @render()

    typeahead: (event) ->
      code = event.which or event.keyCode or event.charCode
      char = String.fromCharCode code

      @tah.position(event.target)

      switch char
        when '@'
          @buf = ''
          @tah.showUser()
        when '#'
          @buf = ''
          @tah.showTask()
        when '+'
          @buf = ''
          @tah.showProject()
        when ' '
          @buf = ''
          @tah.hide()
          true
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
            @tah.updateQuery @buf

    submit: (event) ->
      event.preventDefault()
      event.stopPropagation()

      data = Backbone.Syphon.serialize event.currentTarget
      @$("[type=submit]").addClass("disabled").text("Updating information...")
      @model.save data, {success: @success, error: @success}

      false

    success: (model, response, options) ->
      if response.success is true
        @hide
        return true
      else
        console.log(response)
        alert "An error occured"
        return false

    show: ->
      @$el.show()
      @$("form input").focus()

    hide: (event) ->
      if event
        event.preventDefault()
        event.stopPropagation()
      @$el.hide()

    render: ->
      @html = views[@view](@context)
      @$el.hide()
      @$el.html("")
      @$el.append(@html)
      @

  class exports.CreateProjectForm extends InlineForm
    el: "#create-project-inline"
    view: "dashboard/create_project"

    success: (model, response, options) ->
      if super model, response, options
        projects.fetch()

    initialize: (context) ->
      @model = new models.Project

      super context

  class exports.EditProjectForm extends InlineForm
    el: ".main-area"
    view: "dashboard/edit_project"

    success: (model, response, options) ->
      if super model, response, options
        projects.fetch()

    initialize: (context) ->
      @model = context.model
      @model.url = "/project/#{context.projectId}"

      super context

  class exports.CreateTaskForm extends InlineForm
    el: "#create-task-inline"
    view: "dashboard/create_task"

    success: (model, response, options) ->
      if super model, response, options
        tasks.fetch()

    initialize: ->
      @model = new models.Task
      @model.url = "/task/#{projectId}"

      super()

  class exports.CreateTaskCommentForm extends InlineForm
    view: "dashboard/create_task_comment"

    success: (model, response, options) ->
      if super model, response, options
        tasks.fetch()

    initialize: (context) ->
      @model = new models.TaskComment
      @model.url = "/task/comment/#{taskId}"

      super context

  class Task extends View
    initialize: (context) ->
      @context = context
      super context
      @render()

    render: ->
      html = views['dashboard/task'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard-task'
      @

  class exports.Dashboard extends View
    events:
      'click .project-list li a': "editProject"
      'click .project-list li': "switchProject"

      'click #create-project-button': "showProjectForm"
      'click #create-subproject-button': "showSubProjectForm"
      'click #delete-project-button': "deleteProject"

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
      if typeof e isnt 'object'
        taskId = e
      else
        e.preventDefault()
        e.stopPropagation()

        taskId = e.target.attributes['rel'].value

      task = tasks.get(taskId)

      app.navigate "/dashboard/project/#{projectId}/task/#{taskId}", trigger: false

      @context.task = task.toJSON()
      @context.el = "#main-area"
      @taskView = new Task @context

    editProject: (e) ->
      e.preventDefault()
      e.stopPropagation()

      projectId = e.target.attributes['rel'].value
      project = projects.get(projectId)

      @context.projectId = projectId
      @context.project = project.toJSON()
      @context.model = project

      @parsePermissions @context.user, @context.project

      editProjectForm = new exports.EditProjectForm @context

      editProjectForm.show()

    deleteProject: (e) ->
      e.preventDefault()
      project.url = "/project/#{projectId}"
      project.destroy(
        success: (model, response) =>
          @context.project = null
          @context.projectId = ""
          project = null
          projectId = ""

          projects.fetch()
      )

    showSubProjectForm: (e) ->
      e.preventDefault()
      @createProject = new exports.CreateProjectForm @context
      @createProject.show()

    showProjectForm: (e) ->
      e.preventDefault()
      @context.project = null
      @createProject = new exports.CreateProjectForm @context
      @createProject.show()

    showTaskForm: (e) ->
      e.preventDefault()
      @createTask.show()

    showTaskCommentForm: (e) ->
      e.preventDefault()
      e.stopPropagation()
      createTaskComment = new exports.CreateTaskCommentForm _.extend(@context, el: "#task-add-comment-#{taskId}")
      createTaskComment.show()

    switchProject: (e)->
      if typeof e isnt 'object'
        projectId = e
      else
        projectId = e.target.attributes['rel'].value
      project = projects.get(projectId)

      @context.projectId = projectId
      @context.project = project.toJSON()

      @parsePermissions @context.user, @context.project

      app.navigate "/dashboard/project/#{projectId}", trigger: false

      taskId = null

      tasks.url = "/task/#{projectId}"
      tasks.fetch()
      #@render()

    initialize: (params) ->
      console.log '[__dashboardView__] Init'
      @context.title = "Dashboard"
      @context.user = app.session.toJSON()
      @context.canEdit = (user, project) ->
        if user._id is project.client.id then return true
        for _user in project.write
          if _user.id is user._id then return true
        false

      @listenTo projects, "reset", @updateProjectList, @
      @listenTo tasks, "reset", @updateTaskList, @

      projectId = params.project
      taskId = params.task

      projects.fetch()

    updateProjectList: (collection) ->
      _projects = []
      collection.each((item) ->
        _projects.push item.toJSON())
      @context.projects = _projects
      if projectId
        if taskId
          tasks.url = "/task/#{projectId}"
          tasks.fetch()
        else
          return @switchProject projectId

      @render()

    updateTaskList: (collection) ->
      _tasks = []
      collection.each((item) ->
        _tasks.push item.toJSON())
      @context.tasks = _tasks
      if taskId
        return @openTask taskId

      @render()

    render: ->
      html = views['dashboard/dashboard'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard'

      @createTask = new exports.CreateTaskForm

      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)
