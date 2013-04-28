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
    bills 			        : "/profile/bills"
    users_with_stripe   : "admin/users_with_stripe"
    blog_url            : "blog"

    
  class App extends Backbone.Router
    conf: conf

    setTitle: (title) ->
      if title?
        $("title").html(title)

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
      ###
        Check if we have a query on the transition
      ###
      {meta} = app
      qs = help.qs.parse window.location.search
      if not qs?.q? and (q = meta.getQuery()).length > 0
        return app.navigate "#{window.location.pathname}?q=#{q}", {trigger: true}
      else if qs?.q?.length > 0
        meta.setQuery qs.q

      @reRoute()
      @view = new views.Discover
        prevView:@view
    
    language_list: ->
      @reRoute()
      @view = new views.Languages
        prevView: @view
    
    repo_list: (language) ->
      @reRoute()
      @view = new views.ModuleList
        prevView: @view
        language: language
      
    repo: (language, repo)->
      @reRoute()
      @view = new views.Repo
        prevView: @view
        language: language
        repo: repo
        
    dashboard: ->
      @reRoute()
      if app.session.get("is_authenticated")
          @view = new views.Dashboard prevView:@view
      else
          app.navigate app.conf.signin_url, trigger: true

    project: (id) ->
      @reRoute()
      if app.session.get("is_authenticated")
        @view = new views.Dashboard prevView:@view, project: id
      else
        app.navigate app.conf.signin_url, trigger: true

    task: (project, task) ->
      @reRoute()
      if app.session.get("is_authenticated")
        @view = new views.Dashboard prevView:@view, project: project, task: task
      else
        app.navigate app.conf.signin_url, trigger: true

    admin: (opts...) ->
      @reRoute()
      unless app.session.isSuperUser()
        return app.navigate "/", {trigger: true}

      action = opts[0] if opts?
      get    = opts[1..] if opts?.length > 1
      @view = new views.AdminBoard prevView: @view, action: action, get: get

    blog: (action, subaction) ->
      console.log "Blog"
      @reRoute()

  routes = [
    {key: "(!/)"                                                  , name: "index"}
    {key: "(!/)#{conf.discover_url}(?:querystring)"               , name: "discover"}
    {key: "(!/)#{conf.signin_url}"                                , name: "login"}
    {key: "(!/)#{conf.profile_url}(/:action)(/:profile)"          , name: "profile"}
    {key: "(!/)#{conf.how_to_url}"                                , name: "how-to"}
    {key: "(!/)#{conf.modules_url}"                               , name: "language_list"}
    {key: "(!/)#{conf.modules_url}/:language"                     , name: "repo_list"}
    {key: "(!/)#{conf.modules_url}/:language/:repo"               , name: "repo"}
    {key: "(!/)#{conf.dashboard_url}"                             , name: "dashboard"}
    {key: "(!/)#{conf.dashboard_url}/project/:id"                 , name: "project"}
    {key: "(!/)#{conf.dashboard_url}/project/:project/task/:task" , name: "task"}
    {key: "(!/)#{conf.admin_url}(/:action)(/:subaction)"          , name: "admin"}
    {key: "(!/)#{conf.blog_url}(/:action)(/:subaction)"           , name: "blog"}
  ]

  $(document).ready ->

    router = {}
    _.each routes, (route)-> router[route.key] = route.name
    App.prototype.routes = router

    
    console.log '[__app__] init done!'
    exports.app = app = new App()
    
    app.meta        = new views.MetaView   el:$('body')
    app.shareIdeas  = new views.ShareIdeas el:$('.share-common')
    app.session     = new models.Session()
    
    app.session.once "sync", =>

      Backbone.history.start {pushState: true}        
      app.init()
      
      $(document).delegate "a", "click", (e)->
        $this = $(e.currentTarget)

        return true if $this.data("nobackbone")?
        return true unless (href = $this.attr('href'))
                          
        if href[0] is '/' and ! /^\/auth\/.*/i.test(href)
          uri = if Backbone.history._hasPushState then \
            e.currentTarget.getAttribute('href').slice(1) else \
            "!/"+e.currentTarget.getAttribute('href').slice(1)
          
          app.navigate uri, {trigger:true}
          return false

        else if href[0] is '?'
          path = window.location.pathname
          search = href
          app.navigate "#{path}#{search}", {trigger: false}
          return false
        
)(window)

$.webshims.debug = true
$.webshims.setOptions(
  basePath: "/static/webshims/js-webshim/dev/shims/"
)
$.webshims.polyfill "forms forms-ext"

$.webshims.ready("forms forms-ext", ->
  $('body').on('firstinvalid', 'form', (e) ->
    $.webshims.validityAlert.showFor e.target
    return false;
  )
)
