{esClient, get_models} = require '../conf'
BasicController = require './basicController'
_ = require 'underscore'
[User] = get_models ["User"]

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
  User.findById req.params.id, (error, user) ->
    if error or not user then return res.json {success: false, error: error}

    if req.param('type') is 'reader'
      user.info_reader = req.param('about')
      user.skills_reader = req.param('skill-list').split(',')
      user.links_reader = req.param('links').split(',')
    else
      user.info_writer = req.param('about')
      user.skills_writer = req.param('skill-list').split(',')
      user.links_writer = req.param('links').split(',')

    user.save (error, result) ->
      if error
        res.json {success: false, error: error}
      else
        res.json {success: true}