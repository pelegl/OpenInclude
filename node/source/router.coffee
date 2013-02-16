{STATIC_URL} = require './conf'
hb = require 'handlebars'

exports.set = (app)->

  app.get '/discover', (req,res)=>
    context      = {title: "Home Page", STATIC_URL, in_stealth_mode: true}
    context.body = hb.compile(app.Views['discover/index'])(context)    
    res.render 'base', context
  
  app.get '/*', (req,res)=>
    context      = {title: "Home Page", STATIC_URL, in_stealth_mode: true}
    context.body = hb.compile(app.Views.index)(context)    
    res.render 'base', context
  
    
