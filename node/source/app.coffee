###
  Dependencies
###
express       = require 'express'
connect       = require 'connect'

RedisStore    = require('connect-redis')(connect)
store         = new RedisStore()
secret        = "dsakldaSAKDLJkasl192a12"

cluster       = require 'cluster'
numCPUs       = require('os').cpus().length

#hbs           = require('consolidate').handlebars
conf          = require './conf'
async         = require 'async'
_             = require 'underscore'


###
Configuration of the variables
###
app  = express()
root = __dirname

dot = require 'dot'
fs = require 'fs'
renderFile = (filename, options, fn) ->
    if typeof options == "function"
        fn = options
        options = {}
    fn = ( -> ) if typeof fn != "function"
    
    if app.Layouts and app.Layouts.hasOwnProperty(@name)
        try
            fn null, app.Layouts[@name](options, null, {partials: app.Partials})
        catch err
            fn err
    else
        layout = dot.compile(fs.readFileSync(filename, 'utf8'), {partials: app.Partials})
        if not app.Layouts
            app.Layouts = {}
            
        app.Layouts[@name] = layout
        
        try
            fn null, app.Layouts[@name](options, null, {partials: app.Partials})
        catch err
            fn err

startApp = ->
  app.configure ->
    #app.engine 'hbs', hbs
    app.set 'env'         , process.env.NODE_ENV || 'dev'
    #app.set 'view engine' , 'hbs'
    app.engine "dot", renderFile
    app.set "view engine", "dot"
    app.set 'views'       , "#{root}/views/layouts"
    app.use '/static'     , express.static "#{root}/static"
        
    app.use (req,res,next)->
      req.app = app
      next()
    app.use express.methodOverride()
    app.use express.bodyParser {uploadDir: "#{root}/tmp"}
    app.use express.cookieParser secret
    app.use express.session {store, key: 'openinclude.sess'}
    app.use conf.passport_initialize()
    app.use conf.passport_session()        
    app.use express.methodOverride()    
    app.use app.router
    
  
  app.configure "production", ->
    app.set 'port', 4444
    app.set 'host', '127.0.0.1'
    app.use express.errorHandler
      dumpExceptions: false
      showStack: false
    app.use (err,req,res,next)->
      res.send "Error", 500
  
  app.configure "dev", ->
    app.set 'port', process.env.PORT || 8900
    app.set 'host', '0.0.0.0'
    app.use express.errorHandler
      dumpExceptions: true
      showStack: true
  
  #preloading views into memory cache
  async.auto {
    views: (cb)=>
      conf.registerPartials "#{root}/views/partials", cb
    controllers: conf.setControllers
    router: ['views',(cb, results)=>
      app.Views = results.views.views
      app.Partials = results.views.partials
      app.Controllers = results.controllers
      require('./router').set app
      cb null      
    ]
  }, (err, results)=>
    unless err
      port = app.get('port')
      host = app.get('host')
      app.listen port, host, ->              
        console.log "[__app__] Listening #{host}:#{port}"
    else
      console.log err

forkApp = ->
  if process.env.NODE_ENV is "production"
    if cluster.isMaster
      i = 0
      while i < numCPUs
        cluster.fork()
        i++
      cluster.on "exit", (worker, code, signal) ->
        console.error "[__cluster__] Worker " + worker.process.pid + " died."
    else
      startApp()
  else
    startApp()

forkApp() if cluster.isMaster
  

