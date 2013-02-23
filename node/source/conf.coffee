Handlebars  = require 'handlebars'
async       = require 'async'
fs          = require 'fs'
esc         = require 'elasticsearchclient'
mongoose    = require 'mongoose'

passport = require 'passport'
GithubStrategy = require('passport-github').Strategy

exports.db = db = mongoose.createConnection 'localhost', 'openInclude'
exports.git_lang_db = git_lang_db = mongoose.createConnection 'localhost', 'github_languages'
exports.git_modules_db = git_modules_db = mongoose.createConnection 'localhost', 'github_modules'


###
  Elastic search module
###
serverOptions =
  host: 'localhost'
  port: 9200    
  secure: false

exports.esClient = esClient = new esc serverOptions



###
  Some static helpers
###
SERVER_URL = exports.SERVER_URL = "http://ec2-50-19-3-2.compute-1.amazonaws.com:8900"
STATIC_URL = exports.STATIC_URL = "/static/"


###
  Export controllers to the app
###
controllers = {}
exports.setControllers = (cb)->
  dir = __dirname + "/controllers"
  fs.readdir dir, (err, files)=>
    unless err
      files.forEach (file)=>
        unless /^basic/.test file
          controllers["#{file.replace('Controller.coffee','')}"] = require "#{dir}/#{file}"
      cb null, controllers
    else
      cb err

###
  Registering partials in the memory, avoid reading them from FS later on
###

views = {}
exports.registerPartials = registerPartials = (dir, callback, dirViews)->
  format = "hbs"            
  dirViews = "#{dir}/" unless dirViews    
  fs.readdir dir, (err, files) =>
    unless err
      async.forEach files, (file, cb) =>
        file = "#{dir}/#{file}"
        dirs = []
        fs.stat file, (err, stat) =>          
          unless err
            if stat.isDirectory()
              dirs.push file          
            else if stat.isFile()
               ext = file.replace /^.*\.([a-z]+)$/i, "$1"               
               if ext is format              
                 name    = file.replace(dirViews, "").replace ("." + format), ""              
                 content = fs.readFileSync file, 'utf8'                   
                 Handlebars.registerPartial name, content
                 Handlebars.registerPartial name.replace(/\./g, "/"), content
                 views[name] = content
                 
            async.forEach dirs, (d, acb) =>
              registerPartials d, acb, dirViews
            ,cb
          else
            cb err             
      ,(err)=>    
        callback err, views        
    else
      callback err
      
GITHUB_CLIENT_ID = '2361006ea086ad268742'
GITHUB_CLIENT_SECRET = '8983c759727c4195ae2b34916d9ed313eeafa332'

exports.passport_session = () ->
  passport.session()

exports.passport_initialize = () ->
  passport_init()
  passport.initialize()

passport_init = exports.passport_init = () ->
  [User] = load(['User'])

  passport.serializeUser((user, done) ->
    console.log('ser', user.github_id)
    done(null, user.github_id)
  )

  passport.deserializeUser((id, done) ->
    console.log('deser', id)
    User.findOne({github_id: id}, (error, user) ->
      if error then return done(error)

      done(null, user)
    )
  )

  passport.use new GithubStrategy(
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "#{SERVER_URL}/auth/github/callback"
  , (access_token, refresh_token, profile, done) ->
    # console.log(access_token, refresh_token, profile)
    console.log('verify', profile)
    User.findOne({github_id: profile.id}, (error, user) ->
      if error then return done(error)
      if user then return done(null, user)

      user = new User(
        github_id: profile.id
        github_display_name: profile.displayName
        github_username: profile.username
        github_avatar_url: profile._json.avatar_url
      )
      user.save((error, user) ->
        if error then return done(error)
        if user then return done(null, user)
      )
    )
  )

exports.github_auth = (options) ->
  passport.authenticate 'github', options


exports.is_authenticated = (request, response, next) ->
  unless request.isAuthenticated()
    return response.redirect('/login')
  next()

#### Models
loaded_models = {}

load = (required) ->
  models = []

  required.forEach((name) ->
    unless loaded_models[name]
      module = require './models/' + name
      if module.schema
        module.collection = mongoose.Schema module.schema
        module.model = db.model name, module.collection

        models.push(module.model)
      loaded_models[name] = module
    else
      models.push(loaded_models[name].model)
  )

  models

module.exports.get_models = load
