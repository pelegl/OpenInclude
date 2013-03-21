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
  
  profile: ->
    User.findOne({github_username: @get[0]}, (result, user) =>
        if result or user is null
            @res.status(404)
            @res.json({success: false})
        else
            @res.json(user.public_info())
    )

  list: ->
    query = User.find().select()
    if @get?
      regexp = new RegExp("^#{@get[0]}")
      query.where 'github_username', regexp
    query.exec((result, users) =>
      if result then return @res.json success: false

      data = _.map(users, (user) ->
        return {title: user.get("github_username"), value: user.get("github_username")}
      )

      @res.json data
    )
     

module.exports = (req,res)->
  new SessionController req, res
