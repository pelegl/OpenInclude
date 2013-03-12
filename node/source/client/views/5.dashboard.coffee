((exports) ->  

  root = @
  views = @hbt = Handlebars.partials
  
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
              alert response.error
              return false
              
      show: ->
          @$el.show()
          
      hide: (event) ->
          if event
              event.preventDefault()
          @$el.hide()
          
      initialize: ->
          @context = _.extend {}, app.conf
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
          
      initialize: ->
          @model = new models.Project
          
          super()
          
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
      'click .project-list li' : "switchProject"
      
      'click #create-project-button' : "showProjectForm"
      'click #delete-project-button' : "deleteProject"
      
      'click #create-task-button' : "showTaskForm"
    
    clearHref: (href)->
      return href.replace "/#{@context.dashboard_url}", ""
    
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
      @context.projectId = projectId
      project = projects.get(projectId)
      @context.project = project.toJSON()
      tasks.url = "/task/#{projectId}"
      tasks.fetch()
      @render()
      
    initialize: ->      
      console.log '[__dashboardView__] Init'      
      @context.title = "Dashboard"
      
      projects.on "reset", @updateProjectList, @
      projects.fetch()
      
      tasks.on "reset", @updateTaskList, @
    
    updateProjectList: (collection) ->
        _projects = []
        collection.each((item) ->
            _projects.push item.toJSON())
        @context.projects = _projects
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
