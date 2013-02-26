class IdeaController extends require('./basicController')

  index: ->
    console.log(@req.body.email, @req.body.ideas)
    @res.redirect('/')
 
module.exports = (req,res)->
  new IdeaController req, res
