Handlebars  = require 'handlebars'
async       = require 'async'
fs          = require 'fs'
esc         = require 'elasticsearchclient'


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
exports.STATIC_URL = "/static/"


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
      
