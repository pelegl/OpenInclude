###
  Dependencies
###
express       = require 'express'
connect       = require 'connect'
https         = require 'https'
http          = require 'http'
fs            = require 'fs'
certpath      = "#{__dirname}/../../certificates"

httpsPort     = process.env.httpsPort || 8443

files = [
  "DigiCertCA.crt"
  "TrustedRoot.crt"
]

ca            = (fs.readFileSync("#{certpath}/#{file}") for file in files)
privateKey    =  fs.readFileSync("#{certpath}/openinclude_com.key").toString()
certificate   =  fs.readFileSync("#{certpath}/openinclude_com.crt").toString()

credentials   = {key: privateKey, cert: certificate, ca}



secret        = "dsakldaSAKDLJkasl192a12"

cluster       = require 'cluster'
numCPUs       = require('os').cpus().length

#hbs           = require('consolidate').handlebars
conf          = require './conf'
async         = require 'async'
_             = require 'underscore'


RedisStore    = require('connect-redis')(connect)
store         = new RedisStore()

###
Configuration of the variables
###
app  = express()
root = __dirname


startApp = ->
  app.configure ->
    #app.engine 'hbs', hbs
    app.set 'env'         , process.env.NODE_ENV || 'dev'
    #app.set 'view engine' , 'hbs'
    app.engine "dot", conf.dotJs
    app.set "view engine", "dot"
    app.set 'views'       , "#{root}/views/layouts"

    app.use express.compress()
    app.use (req,res,next)->
      unless req.secure
        loc = "https://#{req.host}:#{httpsPort}#{req.url}"
        console.log loc
        res.redirect 301, loc
      else
        next()

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
    app.set 'port', process.env.PORT || 80
    app.set 'host', process.env.HOST || 'openinclude.com'
    app.use express.errorHandler {dumpExceptions: false, showStack: false}
    app.use (err,req,res,next)->
      res.send "Error", 500
  
  app.configure "dev", ->
    app.set 'port', process.env.PORT || 9100
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
      # perform background jobs once in a while
      require('./background_jobs')(app)
      # start app

      port = app.get('port')
      host = app.get('host')

      http.createServer(app).listen port, host
      https.createServer(credentials, app).listen httpsPort, host, ->
        console.log "[__app__] Listening #{host}:#{port}"
    else
      console.log err

forkApp = ->
  if process.env.NODE_ENV is "production"
    if cluster.isMaster and numCPUs > 1
      i = 0
      ###
        Fork for production - to use multiple cores
      ###
      while i < numCPUs
        cluster.fork()
        i++
      cluster.on "exit", (worker, code, signal) ->
        console.error "[__cluster__] Worker " + worker.process.pid + " died."
    else
      startApp()
  else
    startApp()


if cluster.isMaster
  forkApp()
  ###
    Master worker --- cron job
  ###
  require("./cron") unless process.env.NODE_ENV isnt "production"