((exports)->
  class App extends Backbone.Router      
    routes:
      "":"index"
      "!/":"index"
      "discover*":"discover"
      "!/discover*":"discover"

    init: -> 
      if !Backbone.history._hasPushState
        console.log 'try to navigate'
        hash = Backbone.history.getHash()
        @navigate('', {trigger:false})
        @navigate(hash, {trigger:true})

    reRoute:->
      if !Backbone.history._hasPushState and Backbone.history.getFragment().slice(0,2) isnt '!/'
        @navigate('!/'+Backbone.history.getFragment(), {trigger:true})
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
      #@view = new views.Index prevView:@view

  $(document).ready ->
    console.log '[__app__] init done!'
    exports.app = app = new App()
    
    app.meta = new views.MetaView el:$('body')
    
    Backbone.history.start {pushState: true}
    app.init()
    $(document).delegate "a", "click", (e)->
      if e.currentTarget.getAttribute('href')[0] is '/'
        uri = if Backbone.history._hasPushState then \
          e.currentTarget.getAttribute('href').slice(1) else \
          "!/"+e.currentTarget.getAttribute('href').slice(1)
        
        app.navigate uri, {trigger:true}
        # e.preventDefault()
        false
        
)(window)