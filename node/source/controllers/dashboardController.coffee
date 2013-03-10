_            = require 'underscore'

class DashboardController extends require('./basicController')   
  
  index: ->    
    @context.title = 'Dashboard'
    @context.body = @_view 'dashboard/dashboard', @context
    @res.render 'base', @context
 
module.exports = (req,res)->
  new DashboardController req, res
