((exports)->
  ###
    Configuring plugins
  ###

  $.cookie.json = true


  conf = 
    STATIC_URL          : "/static/"
    in_stealth_mode     : false
    logout_url          : "/auth/logout"
    profile_url         : "profile"
    signin_url          : "profile/login"
    github_auth_url     : "/auth/github"
    trello_auth_url     : "/auth/trello"
    discover_url        : "discover"
    how_to_url          : "how-to"
    modules_url         : 'modules'
    merchant_agreement  : '/profile/merchant_agreement'
    developer_agreement : '/profile/developer_agreement'
    update_credit_card  : '/profile/update_credit_card'
    dashboard_url       : "dashboard"
    create_project_url  : "dashboard/project/create"
    partials            : window.dt
    admin_url           : "admin"
    view_bills 			    : "/profile/view_bills"
    create_bills 			  : "/admin/create_bills"
    users_with_stripe   : "/admin/users_with_stripe"

    
  class App extends Backbone.Router
    conf: conf

    init: ->
      if !Backbone.history._hasPushState        
        hash = Backbone.history.getHash()
        @navigate '',   {trigger:false}
        @navigate hash, {trigger:true}

    reRoute:->
      if !Backbone.history._hasPushState and Backbone.history.getFragment().slice(0,2) isnt '!/'
        @navigate '!/'+Backbone.history.getFragment(), {trigger:true}
        document.location.reload()

    go: (fr, opts={trigger:true})->
      if Backbone.history._hasPushState
        exports.app.navigate fr, opts
      else
        if fr.slice(0,1) is '!'
          exports.app.navigate fr, opts
        else
          exports.app.navigate '!/'+fr, opts

    index: ->
      @reRoute()
      @view = new views.Index prevView:@view

    profile: (action, opts...) ->
      @reRoute() 
      if app.session.get("is_authenticated") is true
        if action is 'view'
          @view = new views.Profile { prevView: @view, model: app.session, action: "/#{action}", profile: opts[0] }
        else
          @view = new views.Profile { prevView: @view, model: app.session, action: "/#{action}", opts }
      else
        app.navigate '/profile/login', {trigger: true}       
    
    'how-to': ->
      @reRoute()      
      @view = new views.HowTo prevView:@view
    
    login: ->
      @reRoute()
      console.log "login", app.session.get("is_authenticated") is true
      if app.session.get("is_authenticated") is true
        app.navigate '/profile', {trigger: true}    
      else
        @view = new views.SignIn prevView:@view
          
    discover: ->
      @reRoute()
      @view = new views.Discover prevView:@view
    
    language_list: ->
      @reRoute()
      @view = new views.Languages
        el: $('.contents')
        prevView:@view
    
    repo_list: (language) ->
      @reRoute()
      @view = new views.ModuleList
        el: $('.contents')
        prevView: @view
        language: language
      
    repo: (language, repo)->
      @reRoute()
      @view = new views.Repo
        el: $('.contents')
        prevView: @view
        language: language
        repo: repo
        
    dashboard: ->
      @reRoute()
      if app.session.get("is_authenticated")
          @view = new views.Dashboard prevView:@view
      else
          app.navigate app.conf.signin_url, trigger: true
    

  $(document).ready ->
    route_keys = [
      ""
      "!/"
      # Discover URL
      conf.discover_url
      "!/#{conf.discover_url}"
      
      # Sign In
      conf.signin_url
      "!/#{conf.signin_url}"
      
      # Profile URL
      conf.profile_url
      "!/#{conf.profile_url}"
      
      "#{conf.profile_url}/:action"
      "#{conf.profile_url}/:action/:profile"
      "!/#{conf.profile_url}/:action"
      "!/#{conf.profile_url}/:action/:profile"
            
      # How-to
      conf.how_to_url  
      "!/#{conf.how_to_url}" 
      
      # Modules      
      conf.modules_url
      "!/#{conf.modules_url}"     
      "#{conf.modules_url}/:language"
      "!/#{conf.modules_url}/:language"
      "#{conf.modules_url}/:language/:repo"
      "!/#{conf.modules_url}/:language/:repo"
      
      conf.dashboard_url
      "!/#{conf.dashboard_url}"
    ]
    
    route_paths = [
      "index"
      "index"
      "discover"
      "discover"
      "login"
      "login"
      "profile"
      "profile"
      "profile"
      "profile"
      "profile"
      "profile"
      "how-to"
      "how-to"
      "language_list"
      "language_list"
      "repo_list"
      "repo_list"
      "repo"
      "repo"
      "dashboard"
      "dashboard"
    ]
          
    App.prototype.routes = _.object route_keys, route_paths
    
    console.log '[__app__] init done!'
    exports.app = app = new App()
    
    app.meta        = new views.MetaView el:$('body')
    app.shareIdeas  = new views.ShareIdeas el:$('.share-common')
    app.session     = new models.Session()
    
    app.session.once "sync", =>

      Backbone.history.start {pushState: true}        
      app.init()
      
      $(document).delegate "a", "click", (e)->
        href = e.currentTarget.getAttribute('href')
        return true unless href
                          
        if href[0] is '/' and ! /^\/auth\/.*/i.test(href)
          uri = if Backbone.history._hasPushState then \
            e.currentTarget.getAttribute('href').slice(1) else \
            "!/"+e.currentTarget.getAttribute('href').slice(1)
          
          app.navigate uri, {trigger:true}
          # e.preventDefault()
          return false
        else if href[0] is '?'
          path = window.location.pathname
          search = href
          app.navigate "#{path}#{search}", {trigger: false}
          return false
        
)(window)
