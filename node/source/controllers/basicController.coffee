_            = require 'underscore'
hb           = require 'handlebars'

{STATIC_URL} = require '../conf'

class BasicController
  constructor: (@req,@res)->    
    path = @req.path
    
    console.log path
    
    segments = _.without path.split("/"), ""
    
    @controllerName = segments[0]
    @funcName       = if segments[1]? and ! /^_/.test(segments[1]) then segments[1] else 'index' # functions starting with _ - are internal functions
    @get            = segments[2..] if segments.length > 2
    
    if typeof @[@funcName] is 'function'
      @app = @req.app
      context = 
        title: "Home Page"
        STATIC_URL: STATIC_URL
        in_stealth_mode: true
      if @context then _.extend @context, context else @context = context #extend our context - maybe we had already set it up in the child contstructor
      
      @[@funcName]()
    else
      @res.send "Error 404", 404
      
  _view : (name, context)=>
    return hb.compile(@app.Views[name])(context)

module.exports = BasicController