{STATIC_URL, github_auth, get_models, is_authenticated, github_auth_url, logout} = require './conf'
hb = require 'handlebars'

exports.set = (app)->
  app.get '/discover',   app.Controllers.discover    
  app.get '/discover/*', app.Controllers.discover


  app.get '/profile', is_authenticated, app.Controllers.profile
  app.get '/session*', app.Controllers.session

  app.post '/share-idea', app.Controllers.idea

  app.get "/auth/logout", logout
  app.get "#{github_auth_url}", github_auth()  
  app.get "#{github_auth_url}/callback", github_auth(scope: 'user', failureRedirect: '/login'),
    (request, response) -> response.redirect('/profile')
  
  app.get '/*', app.Controllers.index    
