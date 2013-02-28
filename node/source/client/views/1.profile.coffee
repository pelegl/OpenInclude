((exports) ->  
  root = @  
  views = @hbt = Handlebars.partials
        
  
  class exports.SignIn extends View
    initialize: ->
      console.log '[_signInView__] Init'
      @context.title = "Authentication"
      @context.github_auth_url = "/auth/github"
      @render()
    
    render: ->
      html = views['registration/login'](@context)
      @$el.html html
      @$el.attr 'view-id', 'registration'
      @
  
  
  class exports.Profile extends View
    initialize: ->
      console.log '[__profileView__] Init'
      @context.title = "Personal Profile"
      @listenTo @model, "all", @render
      @model.fetch()                 
      @render()
    
    render: ->
      @context.user = @model.toJSON()
      html = views['member/profile'](@context)
      @$el.html html
      @$el.attr 'view-id', 'profile'
      @
      
    
#-----------------------------------------------------------------------------------------------------------------------#
).call(this, (window.views = {}))