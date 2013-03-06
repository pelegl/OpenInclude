{get_models} = require '../conf'
ObjectId = require('mongoose').Schema.Types.ObjectId
api_key = 'sk_test_nKT89JJk0amZjpRcjIrCr1kX'
stripe = require("stripe")(api_key)
[User] = get_models ["User"]
definition =
  	date: Date #date of payment
	rate: Number #payment rate
	fee:  Number #fee to our system
	hours: Number #hours
	client: ObjectId #client that paid
	receivepayment: Number #developer or project manager that receives the payment
	chargeid:String

statics = 
#Method to add a customer to Stripe
	addCustomer: (userid, desc, cardnum, expmonth, expyear,cvc,callback) ->
		User.get_user userid,(error,user) =>
			if not error and not user.payment_methods
				console.log "Customer creation action"
				stripe.customers.create
				  description:desc
				  card:
				  	number:cardnum
				  	exp_month:expmonth
				  	exp_year:expyear
				  	cvc:cvc
				  , (err,customer) =>
				  	if not err
				  		user.payment_methods = customer.id
				  		user.save (e,r) =>
				  			unless e
				  			  res=
				  				  "userid":userid
				  				  "stripe_data":customer
				  			  return callback(e,res)
				  			else return callback(e)
				  	else return callback(err)
			else
				err =
					'error':'Card already exists or user not found'
				return callback(err)

#Billing a customer
	billCustomer:(userid,amount,callback) =>
		User.get_user '261220',(err,user) =>
			if not err and user.payment_methods
				console.log "Charging"
				stripe.charges.create
				  amount:amount
				  currency:'usd'
				  customer:user.payment_methods
				  , (error,charge) ->
				  	if not error
				  		res=
				  			"userid": userid
				  			"charge_data":charge
				  	return callback(error,res)				  		
			else
				console.log("UserPayment not found")
				err = 
					'error':'payment method of user not found'
				return callback(err)
exports.definition = definition
exports.statics = statics