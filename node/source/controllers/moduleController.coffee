class ModuleController extends require('./basicController') 
  
  index: ->
    @context.body = @_view 'module/index', @context    
    @res.render 'base', @context
  
  

module.exports = (req,res)->
  new ModuleController req, res
