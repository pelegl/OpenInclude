ObjectId = require('mongoose').Schema.Types.ObjectId
api_key = 'sk_test_nKT89JJk0amZjpRcjIrCr1kX'
stripe = require("stripe")(api_key)
schema =
  	date: Date #date of payment
	rate: Number #payment rate
	fee:  Number #fee to our system
	hours: Number #hours
	client: ObjectId #client that paid
	receivepayment: Number #developer or project manager that receives the payment
	chargeid:String
#Schema.plugin require("./plugins/stripe")

methods = 
#Method to add a customer to Stripe
	addCustomer: (desc, cardnum, expmonth, expyear,cvc) ->
		console.log "Customer creation action"
		stripe.customers.create
		  description: desc
		  card:
		  	number:cardnum
		  	exp_month:expmonth
		  	exp_year:expyear
		  	cvc:cvc
		  , (err,customer) ->
		  	return callback(err,charge)
  # Method to bill a customer from Stripe  
	billCustomer:(customerId,amount,callback) ->
		console.log "Charging the client" 
		stripe.charges.create
		  amount: amount
		  currency: 'usd'
		  customer: customerId
		  , (err,charge) ->
		  	return callback(err,charge)
		  			  	
exports.schema = schema
exports.methods = methods