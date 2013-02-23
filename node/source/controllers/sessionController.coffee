{esClient, get_models} = require '../conf'

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
     

module.exports = (req,res)->
  new SessionController req, res
