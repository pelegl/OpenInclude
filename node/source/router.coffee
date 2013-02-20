{STATIC_URL, github_auth} = require './conf'
hb = require 'handlebars'

exports.set = (app)->
  app.get '/discover',   app.Controllers.discover    
  app.get '/discover/*', app.Controllers.discover
  
  app.get '/auth/github', github_auth
  app.get '/auth/github/callback', github_auth failureRedirect: '/#failure',
    (request, response) -> response.redirect('/#success')

  app.get '/*', (req,res)=>
    context      = {title: "Home Page", STATIC_URL, in_stealth_mode: true}
    context.body = hb.compile(app.Views.index)(context)    
    res.render 'base', context
  
    
