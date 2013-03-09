###
  Config
###
{get_models} = require '../conf'
async        = require 'async'

[User,Bill] = get_models ["User","Bill"]


###
  Stripe
###
ObjectId = require('mongoose').Schema.Types.ObjectId
api_key = 'sk_test_nKT89JJk0amZjpRcjIrCr1kX'
stripe = require("stripe")(api_key)

definition =
  date:            Date #date of payment
	rate:            Number #payment rate
	fee:             Number #fee to our system
	hours:           Number #hours
	client:          ObjectId #client that paid
	receivepayment:  Number #developer or project manager that receives the payment
	chargeid:        String


statics = 
#Method to add a customer to Stripe
  addCustomer: (user, desc, cardnum, expmonth, expyear, cvc, fullName, callback) ->
    Tasks = {}
    ###
      Create a token
    ###
    Tasks.token = (token) =>
      stripe.token.create
        card:
          number     : cardnum
          exp_month  : expmonth
          exp_year   : expyear
          cvc        : cvc
          fullName   : fullName
      , token
    
    ###
      Check if this user is already registered in Stripe
    ###
    Tasks.existing_payment_method = (method)=>
      user.get_payment_method 'Stripe', method
      
    Tasks.findOrUpdateCustomer = ['existing_payment_method', 'token', (customer_callback, results)=> 
      {token, existing_payment_method} = results
      unless existing_payment_method        
        ###
          Create new customer
        ###
        stripe.customers.create
          description : desc
          card        : token
        , customer_callback
      else
        ###
          Update existing customer
        ###
        stripe.customers.update existing_payment_method.id, {card: token}, customer_callback            
    ]
    
    ###
      Create stripe payment method if needed
    ###
    Tasks.payment_method = ['findOrUpdateCustomer', (payment_method_callback, results)=>
        {findOrUpdateCustomer, existing_payment_method} = results
        unless existing_payment_method
          paymentMethod = 
            service: "Stripe"
            id     : findOrUpdateCustomer.id
          user.payment_methods.push paymentMethod
          user.save payment_method_callback  
        else
          payment_method_callback null
    ]
    
    ###
      Perform tasks
    ###
    async.auto Tasks, (err) =>
      callback err, user

###
 Billing a customer and Saving Bill
###  
billCustomer: (fromuser,user, amount, callback) ->
  user.get_payment_method 'Stripe', (err, method)=>
    if method
      stripe.charges.create
        amount: amount
        currency: 'usd'
        customer: method.id
      , (error, charge)=>
        unless error
          bill = 
          bill_id: charge.id
          bill_amount: amount
          billing_user: fromuser._id
          billed_user:user._id
          billObj = new Bill bill
          billObj.save (err,succ) =>
          return callback(err,succ)
        else
          callback(error,null)
    else
      callback "No payment method set"
	
exports.definition = definition
exports.statics = statics