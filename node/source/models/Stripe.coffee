###
  Config
###
{get_models} = require '../conf'
async = require 'async'

[User, Bill] = get_models ["User", "Bill"]


###
  Stripe
###
ObjectId = require('mongoose').Schema.Types.ObjectId
api_key  = "sk_test_HkMUKw1bjVE6Sxo218IiMNWP"   # Bills key
#api_key = 'sk_test_07bvlXeoFTA2bKM42Vt0O9SY'   # v@aminev key
#api_key = "sk_test_u8z4kB4SVupeHQ8zZQZ7Bw0N"

api_key = "sk_live_2Cw8Uw9hoTersIgjuykq3Apu" if process.env.NODE_ENV is 'production'

stripe = require("stripe")(api_key)

definition =
  billId: {type: ObjectId, ref: 'Bill'}
  chargeid: String



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
          number: cardnum
          exp_month: expmonth
          exp_year: expyear
          cvc: cvc
          name: fullName
      , token

    ###
      Check if this user is already registered in Stripe
    ###
    Tasks.existing_payment_method = (method)=>
      user.get_payment_method 'Stripe', method

    Tasks.findOrUpdateCustomer = [
      'existing_payment_method', 'token', (customer_callback, results)=>
        {token, existing_payment_method} = results
        unless existing_payment_method
          ###
            Create new customer
          ###
          stripe.customers.create
            description: desc
            card: token.id
          , customer_callback
        else
          ###
            Update existing customer
          ###
          stripe.customers.update existing_payment_method.id, {card: token.id}, (err, customer) ->
            unless err
              customer_callback err, customer
            else
              if err.name is "invalid_request_error"
                # either client does not exist or other error
                results.existing_payment_method = null
                # try to create a customer
                stripe.customers.create
                  description: desc
                  card: token.id
                , customer_callback
              else
                customer_callback err, customer
    ]

    ###
      Create stripe payment method if needed
    ###
    Tasks.payment_method = [
      'findOrUpdateCustomer', (payment_method_callback, results)=>
        {findOrUpdateCustomer, existing_payment_method} = results
        unless existing_payment_method
          paymentMethod =
            service: "Stripe"
            id: findOrUpdateCustomer.id
          user.payment_methods = []
          user.payment_methods.push paymentMethod
          user.save payment_method_callback
        else
          payment_method_callback null
    ]

    ###
      Perform tasks
    ###

    async.auto Tasks, (err, results) =>
      callback err, user

  billCustomer: (bill, callback) ->
    bill.from_user.get_payment_method "Stripe", (err, method) ->
      if method
        stripe.charges.create
          amount: bill.amount * 100
          currency: "usd"
          customer: method.id
        , (error, charge) ->
          unless error
            bill.charge_id = charge.id
            bill.isPaid = true
            bill.date = Date.now()

            bill.save callback

          else
            callback error, null
      else
        callback "No payment method set"

exports.definition = definition
exports.statics = statics
