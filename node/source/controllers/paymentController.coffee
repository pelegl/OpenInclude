{esClient} = require '../conf'

class PaymentController extends require('./basicController') 
  constructor: (@req, @res)->
    @context =
      title : "payment" 
    super
  
  index: ->
    @context.body = @_view 'payment/index', @context    
    @res.render 'base', @context

module.exports = (req,res)->
  new PaymentController req, res
