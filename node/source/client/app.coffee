((exports)->  
  class App extends Backbone.Router
    conf:
      STATIC_URL : "/static/"
          
    routes:
      "":"index"
      "!/":"index"
      "discover":"discover"
      "!/discover":"discover"
      "profile/login": "login"
      "!/profile/login" : "login"
      "profile" : "profile"
      "!/profile" : "profile"
      "how-to" : "how-to"
      "!/how-to" : "how-to"
      "!/module" : "module"
      "module" : "language_list"
      "module/:language"   : "repo_list"
      "!/module/:language" : "repo_list"
      "module/:language/:repo" : "repo"
      "!/module/:language/:repo" : "repo"

    init: -> 
      if !Backbone.history._hasPushState        
        hash = Backbone.history.getHash()
        @navigate('', {trigger:false})
        @navigate(hash, {trigger:true})

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

    profile: ->
      @reRoute()      
      if app.session.get("is_authenticated") is true 
        @view = new views.Profile { prevView: @view, model: app.session }
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
      @view = new views.Module prevView:@view
    
    repo_list: ->
      console.log arguments
      
    repo: ->
      console.log arguments
    

  $(document).ready ->
    console.log '[__app__] init done!'
    exports.app = app = new App()
    
    app.meta = new views.MetaView el:$('body')
    app.session = new models.Session()
    app.session.fetch()
    
    app.session.once "change", =>

      Backbone.history.start {pushState: true}        
      app.init()
      
      $(document).delegate "a", "click", (e)->
        href = e.currentTarget.getAttribute('href')
        if href[0] is '/' and ! /^\/auth\/.*/i.test href
          uri = if Backbone.history._hasPushState then \
            e.currentTarget.getAttribute('href').slice(1) else \
            "!/"+e.currentTarget.getAttribute('href').slice(1)
          
          app.navigate uri, {trigger:true}
          # e.preventDefault()
          false
        
)(window)
