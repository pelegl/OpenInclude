{esClient, get_models}  = require '../conf'
BasicController         = require './basicController'
_                       = require 'underscore'
async                   = require 'async'
[User]                  = get_models ["User"]

class SessionController extends BasicController
  
  constructor: (@req,@res)->
    if @req.xhr
      super
    else
      @res.redirect "/"
    
  index: ->
    if @req.user
      @res.json @req.user.public_info()
    else
      @res.json {is_authenticated: false}


  user_list: ->
    @res.json {success: false}, 400 unless @req.user?.is_superuser

    User.find {}, "github_username github_email payment_methods paypal", (err, users)=>
      return @res.json {err, success: false}, 500 if err?
      async.map users, (user, async_callback)=>

        paypal = user.paypal || "not signed up"
        stripe = user.get_payment_method("Stripe")
        stripe = if stripe? then "signed up" else "not signed up"
        email = user.github_email || null

        async_callback null, {username: user.github_username, email, paypal, stripe}

      ,(err, data)=>
        return @res.json {success: false, err} if err?
        @res.json data

  users_with_stripe: ->
    return @res.json {success: false}, 403 unless @req.user?.is_superuser()
    # get users with payment method
    User.getClientsWithStripe (err, users) =>
      return @res.json {success: false, err} if err?
      @res.json {success: true, users}


  profile: ->
    User.findOne {github_username: @get[0]}, (result, user) =>
        if result or user is null
            @res.json {success: false}, 404
        else
            @res.json user.public_info()

  list: ->
    query = User.find().select()
    if @get?
      regexp = new RegExp("^#{@get[0]}", "i")
      query.where 'github_username', regexp
    else if @req.query.term
      regexp = new RegExp("^#{@req.query.term}", "i")
      query.where 'github_username', regexp
    query.exec((result, users) =>
      if result then return @res.json success: false

      data = _.map(users, (user) ->
        return {label: user.get("github_username"), value: user.get("_id")}
      )

      @res.json data
    )
     

module.exports = (req,res)->
  new SessionController req, res

module.exports.profile_update = (req, res) ->
  return res.json {success: false}, 403 if req.params.id isnt req.user._id.toString()

  {user} = req

  try
    ## update data ##
    if req.param('type') is 'reader'
      user.info_reader   = req.body['about']
      user.skills_reader = JSON.parse req.body['skill-list']
      user.links_reader  = JSON.parse req.body['link-list']
    else
      user.info_writer    = req.body['about']
      user.skills_writer  = JSON.parse req.body['skill-list']
      user.links_writer   = JSON.parse req.body['link-list']

  catch e
    console.log e
    ## catch invalid data ##
    return res.json {success: false, e}, 400

  ## update user ##
  user.save (error, result) ->
    if error
      res.json {success: false, error: error}
    else
      res.json { success: true, user: user.public_info() }