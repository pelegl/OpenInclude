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
    stripeModel.methods.addCustomer "John Brittas","371449635398431","4","2014",(err,customer)=>
    	if not err
    		@res.send customer
    		@res.statusCode = 201
    	else
    		@res.send err
    		@res.statusCode = 500
		
billCustomer: ->
  stripeModel.methods.billCustomer "customerId", "500", (err, charge) =>
    if not err
      stripeObj =
        chargeid: charge.id
        date: charge.created

      billed = new stripeModel(stripeObj)
      billed.save (error, stripe) =>
        unless error
          @res.send charge
          @res.statusCode = 201
        else
          @res.send error
          @res.statusCode = 500

    else
      @res.send err
      @res.statusCode = 500
		
module.exports = (req,res)->
  new PaymentController req, res
