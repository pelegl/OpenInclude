Handlebars  = require 'handlebars'
async       = require 'async'
fs          = require 'fs'

exports.STATIC_URL = "/static/"

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
      
