((exports) ->  

  root = @
  views = @hbt = _.extend({}, dt, Handlebars.partials)
  
  projects = new collections.Projects
  tasks = new collections.Tasks
  projectId = ""
  project = null
  
  class InlineForm extends @Backbone.View
      events:
          'submit form': "submit"
          'click .close-inline': "hide"
      
      submit: (event) ->
          event.preventDefault()
          
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
          
      hide: (event) ->
          if event
              event.preventDefault()
          @$el.hide()
          
      initialize: (context = {}) ->
          @context = _.extend {}, context, app.conf
          @render()
      
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

  class exports.Dashboard extends View
    events:
      'click .project-list li a' : "editProject"
      'click .project-list li' : "switchProject"      
      
      'click #create-project-button' : "showProjectForm"
      'click #delete-project-button' : "deleteProject"
      
      'click #create-task-button' : "showTaskForm"
    
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
    
    showProjectForm: (e) ->
        e.preventDefault()
        @createProject.show()
    
    showTaskForm: (e) ->
        e.preventDefault()
        @createTask.show()
        
    switchProject: (e)->
      projectId = e.target.attributes['rel'].value
      project = projects.get(projectId)
      
      @context.projectId = projectId
      @context.project = project.toJSON()
      
      @parsePermissions @context.user, @context.project
      
      tasks.url = "/task/#{projectId}"
      tasks.fetch()
      @render()
      
    initialize: ->      
      console.log '[__dashboardView__] Init'      
      @context.title = "Dashboard"
      @context.user = app.session.toJSON()
      @context.canEdit = (user, project) ->
        if user._id is project.client.id then return true
        for _user in project.write
          if _user.id is user._id then return true
        false
      
      @listenTo projects, "reset", @updateProjectList, @
      
      projects.fetch()
      
      tasks.on "reset", @updateTaskList, @
    
    updateProjectList: (collection) ->
        _projects = []
        collection.each((item) ->
            _projects.push item.toJSON())
        @context.projects = _projects
        if projectId
            project = projects.get(projectId)
            @context.project = project.toJSON()
        
        @render()
        
    updateTaskList: (collection) ->
        _tasks = []
        collection.each((item) ->
            _tasks.push item.toJSON())
        @context.tasks = _tasks
        @render()
      
    render: ->
      html = views['dashboard/dashboard'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard'
      
      @createProject = new exports.CreateProjectForm
      @createTask = new exports.CreateTaskForm
      
      @
    
#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)
