{STATIC_URL, github_auth, get_models, is_authenticated} = require './conf'
hb = require 'handlebars'
# models = require 'models'

# route = (action, var_args) ->
  # slice = [].slice
  # models = slice.call(arguments, 1)

  # models = get_models(models)

  # () ->
    # arguments_as_array = slice.call(arguments)
    # args = arguments_as_array.concat(models)

    # action.apply(action, args)

# users = (request, response, next, User) ->
  # console.log(request.constructor.prototype)
  # console.log(request.account)
  # console.log(request.user)
  # console.log(request.isAuthenticated())
  # response.send('ok')

exports.set = (app)->
  app.get '/discover',   app.Controllers.discover    
  app.get '/discover/*', app.Controllers.discover
  
  # app.get '/login-models', route(users, 'User')

  app.get '/login', (request, response) ->
    context      = {title: "login", STATIC_URL, in_stealth_mode: false}
    context.body = hb.compile(app.Views['registration/login'])(context)    
    response.render 'base', context

  app.get '/profile', is_authenticated, app.Controllers.profile

  app.get '/auth/github/callback', github_auth(scope: 'user', failureRedirect: '/#failure'),
    (request, response) -> response.redirect('/#success')
      # response.send('github success')
  app.get '/auth/github', github_auth()

  app.get '/*', (req,res)=>
    context      = {title: "Home Page", STATIC_URL, in_stealth_mode: true}
    context.body = hb.compile(app.Views.index)(context)    
    res.render 'base', context

