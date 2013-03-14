{esClient, get_models} = require '../conf'

[User] = get_models ["User"]

class SessionController extends require('./basicController') 
  
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
     

module.exports = (req,res)->
  new SessionController req, res
