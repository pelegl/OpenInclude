((exports) ->  

  root = @  
  views = @hbt = Handlebars.partials
  
  class exports.CreateProject extends @Backbone.View
    id: 'createProject'
    className: "modal hide fade"
    attributes:
      tabindex: "-1"
      role: "dialog"
      "aria-hidden": "true"
    
    events:
      'submit form' : "createProject"
    
    createProject: (e) ->
      e.preventDefault()
      data = Backbone.Syphon.serialize e.currentTarget
      
      @$("[type=submit]").addClass("disabled").text("Updating information...")
      
      jqxhr = @model.save data, {success: @processUpdate, error: @processUpdate}
      
      return false
    
    processUpdate: (model, response, options) ->      
      if response.success is true
        app.session.set {has_stripe: true}, {silent: true}
        @$el.modal 'hide'
        
        setTimeout =>
          app.session.trigger "change"
        , 300
        
      else
        #TODO: do error handling
        
    
    initialize: ->
      @model     = new models.Project
      
      _.bindAll @, "processUpdate"
      
      @context = _.extend {}, app.conf      
      @render()  
    
    show: ->
      @$el.modal 'show'
      @delegateEvents()       
        
    render: ->
      html = views['dashboard/create_project'](@context)
      @$el = $ html
      @$el.modal {show: false}
      @
  
  class exports.Dashboard extends View
    events:
      'click .project-list li' : "switchProject"
      'click #create-project-button' : "showProjectForm"
    
    clearHref: (href)->
      return href.replace "/#{@context.dashboard_url}", ""
    
    showProjectForm: (e) ->
        e.preventDefault()
        @createProject.show()
      
    switchProject: (e)->
      console.log(e)
      @render()
      
    initialize: ->      
      console.log '[__dashboardView__] Init'      
      @context.title = "Dashboard"
      
      @createProject = new exports.CreateProject
      
      @projects = new collections.Projects
      @projects.fetch(
        success: (collection, response, options) =>
            projects = []
            collection.each((item) ->
                projects.push item.toJSON())
            @context.projects = projects
            @render()
      )
    
    render: ->
      html = views['dashboard/dashboard'](@context)
      @$el.html html
      @$el.attr 'view-id', 'dashboard'
      
      @$el.append @createProject.$el
      
      @
    
#-----------------------------------------------------------------------------------------------------------------------#
).call(this, window.views)
