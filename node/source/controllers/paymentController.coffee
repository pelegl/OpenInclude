{get_models,esClient} = require '../conf'

[Stripe,User] = get_models ["Stripe","User"]

class PaymentController extends require('./basicController')
  constructor: (@req, @res)->
    @context =
      title : "payment" 
    super
  
  index: ->  	
    @context.body = @_view 'payment/index', @context    
    @res.render 'base', @context
  
  test: ->
    User.get_user '261220',(err,user) =>
    	@res.send user
    	
    #adds a customer
  addCustomer:->
#  	if req.user
#  		user = 
	    Stripe.addCustomer '261220',"Tom Hanks","371449635398431","4","2014","222",(err,customer)=>
	    	if not err
	    		console.log customer
	    		@res.send customer
	    		@res.statusCode = 201
	    	else
	    		console.log err
	    		@res.send err
	    		@res.statusCode = 500
	#Bills a customer	
  billCustomer: ->
    Stripe.billCustomer "261220", "500", (err, charge) =>
      if not err
        stripeObj =
          chargeid: charge.id
          date: charge.created
        billed = new Stripe(stripeObj)
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
