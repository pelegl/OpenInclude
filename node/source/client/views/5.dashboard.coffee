((exports) ->
  root = @
  views = @hbt = _.extend({}, dt, Handlebars.partials)

  projects  = new collections.Projects
  tasks     = new collections.Tasks
  projectId = ""
  project   = null
  taskId    = ""
  task      = null
  taskEl    = null


  class TypeAhead extends @Backbone.View
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
      width = $(element).width()
      height = $(element).height()

      @$el.css 'left', offset.left
      @$el.css 'top', offset.top + height

      if not @context.listener
        @context.listener = element

    select: (event) ->
      value = $(event.target).attr("rel")
      oldValue = $(@context.listener).val()
      newValue = oldValue.substring(0, @cursor.start + 1) + value + oldValue.substring(@cursor.end + 1)

      $(@context.listener).val(newValue)
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
        @suggestions.fetch()
        @cursor.end = cursor

    hide: ->
      @$el.hide()
      @available = false

    render: ->
      @context.suggestions = @suggestions.toJSON()
      html = views['dashboard/typeahead'](@context)
      @$el.html html
      @$el.show()
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
      @buf = ""
      @render()

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
        projectId = response.id
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
      html = views['dashboard/task'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard-task'
      @

  class Search extends View
    events:
      'submit form': "submit"
      'click button[type=submit]': "preventPropagation"

    preventPropagation: (event) ->
      event.stopPropagation()

    submit: (event) ->
      event.preventDefault()
      event.stopPropagation()

      data = Backbone.Syphon.serialize event.currentTarget
      @tasks = new collections.Tasks
      @listenTo @tasks, "reset", @renderResult

      unless data.search
        data.search = "-"

      unless data.from
        data.from = "none"
      else
        data.from = moment(data.from).unix()

      unless data.to
        data.to = "none"
      else
        data.to = moment(data.to).unix()

      @tasks.url = "/task/search/#{data.search}/#{data.from}/#{data.to}"
      @tasks.fetch()

    initialize: (context) ->
      @context = context
      super context
      @render()

    renderResult: (collection) ->
      _tasks = []
      collection.each((item) ->
        _tasks.push item.toJSON())
      @context.tasks = _tasks
      @render()

    render: ->
      html = views['dashboard/search'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard-search'

      from = @$el.find("input[name=from]")
      to = @$el.find("input[name=to]")

      from.datepicker(
        onClose: (selectedDate) ->
          to.datepicker("option", "minDate", selectedDate)
      )

      to.datepicker(
        onClose: (selectedDate) ->
          from.datepicker("option", "maxDate", selectedDate)
      )

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
      @taskView = new Task _.extend @context, el: "#main-area"

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
      if @createProject?
        @createProject.undelegateEvents()
      @createProject = new exports.CreateProjectForm @context
      @createProject.show()

    showProjectForm: (e) ->
      e.preventDefault()
      @context.project = null
      if @createProject?
        @createProject.undelegateEvents()
      @createProject = new exports.CreateProjectForm @context
      @createProject.show()

    showTaskForm: (e) ->
      e.preventDefault()
      if @createTask?
        @createTask.undelegateEvents()
      @createTask = new exports.CreateTaskForm @context
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

      @listenTo projects, "sync", @updateProjectList, @
      @listenTo tasks,    "sync", @updateTaskList, @

      projectId = params.project
      taskId = params.task

      projects.fetch()

    updateProjectList: (collection) ->
      @context.projects = collection.toJSON()
      if projectId
        if taskId
          tasks.url = "/task/#{projectId}"
          tasks.fetch()
        else
          return @switchProject projectId

      @render()

    updateTaskList: (collection) ->
      @context.tasks = collection.toJSON()
      if taskId
        return @openTask taskId

      @render()

    setParent: (parent, child) ->
      $.get(
        "/project/parent/#{parent}/#{child}"
        (response, status, xhr) ->
          projects.fetch()
      )

    render: ->
      html = views['dashboard/dashboard'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard'

      $(".project-list li").droppable(
        drop: (event, ui) =>
          @setParent(event.target.attributes['rel'].value, ui.draggable.attr("rel"))
      ).draggable(
        containment: "parent"
      )

      unless projectId or taskId
        @searchView = new Search _.extend(@context, el: "#main-area")

      @

#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)
