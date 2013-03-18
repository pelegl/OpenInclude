_   = require 'underscore'
hb  = require 'handlebars'
dot = require 'dot'

{STATIC_URL, urls} = require '../conf'

class BasicController
  constructor: (@req,@res)->    
    path = @req.path
    segments = _.without path.split("/"), ""
    segments = _.map segments, (item) -> decodeURIComponent(item)
    offset = @offset || 0
    
    #@controllerName = segments[0] - not using it, omitting
    @funcName       = if segments[(1-offset)]? and ! /^_/.test(segments[(1-offset)]) then segments[(1-offset)] else 'index' # functions starting with _ - are internal functions
    @get            = segments[(2-offset)..] if segments.length > (2-offset)
    
    if typeof @[@funcName] is 'function'
      @app = @req.app

      config =
        title:      "Home Page"
        STATIC_URL: STATIC_URL
        user:       @req.user

      context = _.extend {}, urls, config

      if @context then _.extend @context, context else @context = context #extend our context - maybe we had already set it up in the child contstructor
      
      @[@funcName]()
    else
      @res.send "Error 404", 404
   #   console.log "404 error"
      
  _view : (name, context)=>
    if @app.Views['dot'].hasOwnProperty(name)
        dot.compile(@app.Views['dot'][name], {partials: @app.Partials})(context, null, {partials: @app.Partials})
    else
        hb.compile(@app.Views['hbs'][name])(context)

module.exports = BasicController
