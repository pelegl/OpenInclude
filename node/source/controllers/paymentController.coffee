{esClient} = require '../conf'
stripeModel = require '../models/Stripe'
class PaymentController extends require('./basicController')
  constructor: (@req, @res)->
    @context =
      title : "payment" 
    super
  
  index: ->  	
    @context.body = @_view 'payment/index', @context    
    @res.render 'base', @context
  addCustomer:->  	
    stripeModel.methods.addCustomer "John Smith","371449635398431","4","2014",@res
#   console.log customerid
#   @res.send 'Created a Customer'
		
module.exports = (req,res)->
  new PaymentController req, res
