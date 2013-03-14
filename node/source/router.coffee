{STATIC_URL, modules_url, github_auth, get_models, is_authenticated, github_auth_url, logout, signin_url, is_not_authenticated} = require './conf'

exports.set = (app)->
  ###
    git webhook
  ###
  app.all '/git/webhook', (req, res)->
    console.log req.body
    
    res.send "ok"
  
  
  ###
  Discover controller
  ###
  app.get '/discover',   app.Controllers.discover    
  app.get '/discover/*', app.Controllers.discover

  ###
  Module controller
  ###
  app.get modules_url,         app.Controllers.module
  app.get "#{modules_url}/*",  app.Controllers.module

  ###
  Share idea
  ###
  app.post '/share-idea', app.Controllers.idea
  
  ###
  Payment
  ###
#  app.get '/payment', app.Controllers.payment
  app.get '/payment/*', app.Controllers.payment
  ###
  Profile interaction
  ###
  app.get signin_url, is_not_authenticated, app.Controllers.profile
  
  app.all '/profile/:action',  is_authenticated, app.Controllers.profile
  app.get  '/profile*',         is_authenticated, app.Controllers.profile  
  
  app.get '/admin*', app.Controllers.admin
  app.post '/admin*', app.Controllers.admin
  ###
  Session interaction
  ###
  app.get '/session*', app.Controllers.session

  ###
  oAuth interaction
  ###
  app.get "/auth/logout", logout  
  app.get "#{github_auth_url}", github_auth()  
  app.get "#{github_auth_url}/callback", github_auth(scope: 'user', failureRedirect: '/profile/login'),
    (request, response) -> response.redirect('/profile')
    
  ###
  App
  ###
  app.get '/*', app.Controllers.index    
