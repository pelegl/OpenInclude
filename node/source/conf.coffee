Handlebars  = require 'handlebars'
async       = require 'async'
fs          = require 'fs'
esc         = require 'elasticsearchclient'
mongoose    = require 'mongoose'
_           = require 'underscore'


require('coffee-trace')

passport       = require 'passport'
GithubStrategy = require('passport-github').Strategy
TrelloStrategy = require('passport-trello').Strategy

if !process.env.mongo
  exports.db = db = mongoose.createConnection 'localhost', 'openInclude'
else
  exports.db = db = mongoose.createConnection process.env.mongo

###
  String capitalize
###
String.prototype.capitalize = ->
  return @charAt(0).toUpperCase() + @slice(1)

###
  Elastic search module
###
serverOptions =
  host: process.env.esHost || 'localhost'
  port: 9200    
  secure: false

exports.esClient = esClient = new esc serverOptions


###
  Github service
###
github = require 'octonode'

git_sets = [
  ['2361006ea086ad268742', '8983c759727c4195ae2b34916d9ed313eeafa332']
  [require("./github").id, require("./github").secret]
]

[GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET] = if process.env.github_local? then git_sets[1] else git_sets[0]

exports.git = github.client "client", GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

exports.git = github.client
  id: GITHUB_CLIENT_ID
  secret: GITHUB_CLIENT_SECRET

###
  Some static helpers
###
SERVER_URL = exports.SERVER_URL = "#{process.env.HOST || "http://ec2-54-225-224-68.compute-1.amazonaws.com"}:#{process.env.PORT || 8900}"
STATIC_URL = exports.STATIC_URL = "/static/"

exports.logout_url      = logout_url      =  "/auth/logout"
exports.profile_url     = profile_url     = "/profile"
exports.signin_url      = signin_url      = "#{profile_url}/login"
exports.github_auth_url = github_auth_url = "/auth/github"
exports.trello_auth_url = trello_auth_url = "/auth/trello"
exports.discover_url    = discover_url    = "/discover"
exports.how_to_url      = how_to_url      = "/how-to"
exports.modules_url     = modules_url     = "/modules"
exports.dashboard_url   = dashboard_url   = "/dashboard"

exports.admin_url       = admin_url       = '/admin'
exports.view_bills      = view_bills 			= "#{profile_url}/view_bills"
exports.create_bills    = create_bills 			= "#{admin_url}/create_bills"
exports.users_with_stripe = users_with_stripe = "#{admin_url}/users_with_stripe"

exports.merchant_agreement        = merchant_agreement  = "#{profile_url}/merchant_agreement"
exports.developer_agreement       = developer_agreement = "#{profile_url}/developer_agreement"
exports.update_credit_card        = update_credit_card  = "#{profile_url}/update_credit_card"

# Transitioning to exports.urls = {}
exports.urls =
  logout_url:           "/auth/logout"
  profile_url:          "/profile"
  signin_url:           "#{profile_url}/login"
  github_auth_url:      "/auth/github"
  trello_auth_url:      "/auth/trello"
  discover_url:         "/discover"
  how_to_url:           "/how-to"
  modules_url:          "/modules"
  dashboard_url:        "/dashboard"
  merchant_agreement:   "#{profile_url}/merchant_agreement"
  developer_agreement:  "#{profile_url}/developer_agreement"
  update_credit_card:   "#{profile_url}/update_credit_card"
  admin_url:            "/admin"
  view_bills:           "#{profile_url}/view_bills"
  create_bills:         "#{admin_url}/create_bills"
  users_with_stripe:    "#{admin_url}/users_with_stripe"

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
          controllers["#{file.replace(/^(.*)Controller.[a-z]+$/i,'$1')}"] = require "#{dir}/#{file}"
      cb null, controllers
    else
      cb err

###
  Registering partials in the memory, avoid reading them from FS later on
###

views = {}
partials = {}
exports.registerPartials = registerPartials = (dir, callback, dirViews)->
  format = ["hbs", 'dot']            
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
               if ext in format              
                 name    = file.replace(dirViews, "").replace ("." + ext), ""              
                 content = fs.readFileSync file, 'utf8'
                 if ext is 'hbs'
                     Handlebars.registerPartial name, content
                     Handlebars.registerPartial name.replace(/\./g, "/"), content
                 else
                     partials[name] = content
                 if views[ext]?
                     views[ext][name] = content
                 else
                     views[ext] = {}
                     views[ext][name] = content
                 
            async.forEach dirs, (d, acb) =>
              registerPartials d, acb, dirViews
            ,cb
          else
            cb err             
      ,(err)=>    
        callback err, {views: views, partials: partials}        
    else
      callback err
      

TRELLO_ID = '48d2041e5c3684d893ef877b2ae2bad3'
TRELLO_SECRET = '0c3da5c0d7afb77ac90b09dd34264d7521498c5b030774af2d853d8a6c00f939'

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
    #callbackURL: "#{SERVER_URL}/auth/github/callback"
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
  
  passport.use 'trello', new TrelloStrategy(
    consumerKey: TRELLO_ID
    consumerSecret: TRELLO_SECRET
    callbackURL: "#{trello_auth_url}/callback"
    passReqToCallback: true
    trelloParams:
        scope: "read,write"
        name: "OpenInclude.com"
        expiration: "never"
    (req, token, tokenSecret, profile, done) ->
        if not req.user
            # user is not authenticated, log in via trello
            # TODO
        else
            User.findById(req.user._id, (error, user) ->
                if error then return done(error)
                
                user.trello_id = profile.id
                user.trello_token = token
                user.trello_token_secret = tokenSecret
                
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

# trello authorization
exports.trello_auth = (options) ->
	passport.authorize 'trello', options

# Models
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
        if module.plugins?
          plugin = require(module.plugins)
          if plugin
            module.schema.plugin(plugin)

        module.schema.set "toJSON", getters: true, virtuals: true
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

exports.model = exports.get_models = load
