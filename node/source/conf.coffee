Handlebars  = require 'handlebars'
async       = require 'async'
fs          = require 'fs'
esc         = require 'elasticsearchclient'
mongoose    = require 'mongoose'
_           = require 'underscore'

passport = require 'passport'
GithubStrategy = require('passport-github').Strategy

exports.db = db = mongoose.createConnection 'localhost', 'openInclude'

###
  String capitalize
###
String.prototype.capitalize = ->
  return @charAt(0).toUpperCase() + @slice(1)

###
  Elastic search module
###
serverOptions =
  host: 'localhost'
  port: 9200    
  secure: false

exports.esClient = esClient = new esc serverOptions


###
  Github service
###
github = require 'octonode'

GITHUB_CLIENT_ID = '4fe07368d108592678ad'
GITHUB_CLIENT_SECRET = 'd058f2945d3ef9ced8b03f24dd12a5aae0f9e12e'

#GITHUB_SETS = [
#  [GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET]
#  ["fbc1f03fd6ef162b3463", "bead2882abb9409df91f4ba7fecc450c6e989d4b"]
#] 

GITHUB_SETS = [
  [GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET]
  ["4fe07368d108592678ad", "d058f2945d3ef9ced8b03f24dd12a5aae0f9e12e"]
]


exports.git = github.client "client", GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
exports.git.setTokens = (set)->
  [@clientID, @clientSecret] = GITHUB_SETS[set] || GITHUB_SETS[0] 


###
  Some static helpers
###
#SERVER_URL = exports.SERVER_URL = "http://localhost:4500"
SERVER_URL = exports.SERVER_URL = "http://ec2-54-225-224-68.compute-1.amazonaws.com:#{process.env.PORT || 9100}"
#SERVER_URL = exports.SERVER_URL = "http://ec2-107-20-8-160.compute-1.amazonaws.com:#{process.env.PORT || 8900}"
STATIC_URL = exports.STATIC_URL = "/static/"

exports.logout_url      = logout_url      =  "/auth/logout"
exports.profile_url     = profile_url     = "/profile"
exports.signin_url      = signin_url      = "#{profile_url}/login"
exports.github_auth_url = github_auth_url = "/auth/github"
exports.discover_url    = discover_url    = "/discover"
exports.how_to_url      = how_to_url      = "/how-to"
exports.modules_url     = modules_url     = '/modules'
exports.admin_url     = modules_url     = '/admin'

exports.merchant_agreement        = merchant_agreement  = "#{profile_url}/merchant_agreement"
exports.developer_agreement       = developer_agreement = "#{profile_url}/developer_agreement"
exports.update_credit_card        = update_credit_card  = "#{profile_url}/update_credit_card"
exports.view_bills       		  = view_bills 			= "#{profile_url}/view_bills"

exports.users_with_stripe         = users_with_stripe 	= "#{admin_url}/users_with_stripe"

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
      

exports.passport_session = () ->
  passport.session()

exports.passport_initialize = () ->
  passport_init()
  passport.initialize()

passport_init = exports.passport_init = () ->
  [User] = load ['User']

  passport.serializeUser (user, done) ->    
    done null, user.github_id

  passport.deserializeUser (id, done) ->    
    User.findOne {github_id: id}, (error, user)=>
      return done(error) if error 
      done null, user

  passport.use new GithubStrategy(
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "#{SERVER_URL}/auth/github/callback"
  , (access_token, refresh_token, profile, done) ->
    # console.log(access_token, refresh_token, profile)
    console.log('verify', profile)
    User.findOne({github_id: profile.id}, (error, user) ->
      console.log user
      if error then return done(error)
      if user then return done(null, user)
      console.log user

      user = new User(
        github_id: profile.id
        github_display_name: profile.displayName
        github_username: profile.username
        github_avatar_url: profile._json.gravatar_id
        github_email: profile._json.email
        github_json : profile._json # might be used later, so we store it
      )
      user.save((error, user) ->
        if error then return done(error)
        if user then return done(null, user)
      )
    )
  )

exports.github_auth = (options) ->
  passport.authenticate 'github', options

exports.logout = (req, res) ->
  req.logout()
  res.redirect "back"

exports.is_authenticated = (request, response, next) ->
  unless request.isAuthenticated()
    return response.redirect signin_url
  next()

exports.is_not_authenticated = (request, response, next) ->
  if request.isAuthenticated()
    return response.redirect profile_url
  next()


#### Models
loaded_models = {}

load = (required) ->
  models = []

  required.forEach((name) ->
    unless loaded_models[name]
      module = require './models/' + name
      if module.definition
        module.schema         = new mongoose.Schema module.definition, (module.options || {})        
        module.schema.methods = module.methods if module.methods
        module.schema.statics = module.statics if module.statics
        
        ###
          Set virtuals
        ###
        if module.virtuals?
          getters = Object.keys module.virtuals.get
          setters = Object.keys module.virtuals.set
          if getters.length > 0
            getters.forEach (getterName)=>              
              module.schema.virtual(getterName).get module.virtuals.get[getterName]            
          if setters.length > 0
            setters.forEach (setterName)=>
              module.schema.virtual(setterName).set module.virtuals.set[setterName]
        
        ###
          Set index        
        ###
        if module.index?
          _.each module.index, (index)=>
            #console.log "Applying index", index
            module.schema.index.apply module.schema, index          
        
        unless module.modelName
          module.model = db.model name, module.schema
        else
          module.model = db.model name, module.schema, module.modelName
          
        models.push module.model

      loaded_models[name] = module
    else
      models.push(loaded_models[name].model)
  )

  models

exports.get_models = load
