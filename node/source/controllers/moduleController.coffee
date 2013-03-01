###
  Loading config
###
{get_models} = require '../conf'

###
  Getting module
###
[Languages] = get_models ["Language"]


class ModuleController extends require('./basicController') 
  
  index: ->
    {page, limit} = @req.query    
    pageNumber = if page then parseInt(page) else 0
    limit = if limit then parseInt(limit) else 0
    
    Languages.get_page pageNumber, limit, (err, output)=>    
      unless err
        if @req.xhr
          @res.json output
        else
          @context.prepopulation  = JSON.stringify output
          @context.languages      = output.languages
          @context.body           = @_view 'module/index', @context    
          
          @res.render 'base', @context
      else
        console.error err
        res.send "Error", 500
        
  
  

module.exports = (req,res)->
  new ModuleController req, res
