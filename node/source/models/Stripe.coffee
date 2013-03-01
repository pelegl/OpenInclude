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
#Schema.plugin require("./plugins/stripe")
methods = 
	addCustomer: (desc, cardnum, expmonth, expyear,res) ->
		console.log "Customer creation action"
		stripe.customers.create
		  description: desc
		  card:
		  	number:cardnum
		  	exp_month:expmonth
		  	exp_year:expyear
		  , (err,customer) ->
		  	if err
		  		console.log err
		  		res.send "Error creating customer "
		  		return
		  	res.send "Created customer : "  + customer.id
		  	
exports.schema = schema
exports.methods = methods