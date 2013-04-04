{STATIC_URL, modules_url, github_auth, get_models, is_authenticated, github_auth_url, trello_auth_url, trello_auth, logout, signin_url, is_not_authenticated, dashboard_url} = require './conf'

exports.set = (app)->

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
  Dashboard
  ###
  app.get dashboard_url, app.Controllers.dashboard
  app.get "#{dashboard_url}/*", app.Controllers.dashboard

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
  app.get  '/profile/view_bills/:id',is_authenticated, app.Controllers.profile
  
  app.get '/admin*', app.Controllers.admin
  app.post '/admin*', app.Controllers.admin
  ###
  Session interaction
  ###
  app.get '/session*', app.Controllers.session
  
  
  ###
  Project
  ###
  app.get "/project", app.Controllers.project.list
  app.get "/project/suggest/:part?", app.Controllers.project.suggest
  app.get "/project/parent/:parent/:child", app.Controllers.project.parent

  app.post "/project", app.Controllers.project.create
  app.put "/project/:id", app.Controllers.project.update
  app.delete "/project/:id", app.Controllers.project.delete
  
  ###
  Task
  ###
  app.get "/task/time/start/:id/:start", app.Controllers.task.start
  app.get "/task/time/end/:id/:end", app.Controllers.task.end
  app.get "/task/search/:search/:from/:to", app.Controllers.task.search

  app.get "/task/:project", app.Controllers.task.list
  app.post "/task/:project", app.Controllers.task.create
  app.put "/task/:id", app.Controllers.task.update
  app.delete "/task/:id", app.Controllers.task.delete

  app.post '/task/comment/:id', app.Controllers.task.comment


  ## Runway ##
  app.get "/api/connection", app.Controllers.runway.connections
  app.post "/api/connection", app.Controllers.runway.create
  
  ###
  oAuth interaction
  ###
  app.get "/auth/logout", logout  
  app.get "#{github_auth_url}", github_auth()  
  app.get "#{github_auth_url}/callback", github_auth(scope: 'user', failureRedirect: '/profile/login'),
    (request, response) -> response.redirect('/profile')
    
  app.get "#{trello_auth_url}", trello_auth()
  app.get "#{trello_auth_url}/callback", trello_auth(failureRedirect: '/profile'),
    (request, response) -> response.redirect('/profile')
    
  ###
  App
  ###
  app.get '/*', app.Controllers.index    
