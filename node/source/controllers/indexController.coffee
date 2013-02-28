{esClient} = require '../conf'

class IndexController extends require('./basicController') 
  constructor: (@req, @res)->    
    @offset = 1
    super
  
  index: ->    
    @context.body = @_view 'index', @context    
    @res.render 'base', @context
  
  login: ->
    @context.title = "Login"
    @context.body = @_view 'registration/login', @context    
    @res.render 'base', @context

  'how-to': ->
    @context.title = "How to"
    @context.body = @_view 'how-to', @context    
    @res.render 'base', @context

module.exports = (req,res)->
  new IndexController req, res
