{STATIC_URL, github_auth} = require './conf'
hb = require 'handlebars'

exports.set = (app)->
  app.get '/discover',   app.Controllers.discover    
  app.get '/discover/*', app.Controllers.discover
  
  app.get '/login', github_auth(failureRedirect: '/login'), (request, response) ->
    context      = {title: "login", STATIC_URL, in_stealth_mode: false}
    context.body = hb.compile(app.Views['registration/login'])(context)    
    response.render 'base', context

  app.get '/profile', github_auth(failureRedirect: '/login'), (request, response) ->
    context      = {title: "profile", STATIC_URL, in_stealth_mode: false}
    context.body = hb.compile(app.Views['registration/login'])(context)    
    response.render 'base', context

  app.get '/auth/github/callback', github_auth(scope: 'user', failureRedirect: '/#failure'),
    (request, response) -> response.redirect('/#success')
      # response.send('github success')
  app.get '/auth/github', github_auth()

  app.get '/*', (req,res)=>
    context      = {title: "Home Page", STATIC_URL, in_stealth_mode: true}
    context.body = hb.compile(app.Views.index)(context)    
    res.render 'base', context

