###
  Config
###
{get_models} = require '../conf'
ObjectId  = require('mongoose').Schema.Types.ObjectId
async     = require 'async'
_         = require 'underscore'
[Bill] = get_models ["Bill"]
###
  Definition
###

PaymentMethod = 
  service: 
    type: String
    enum: ["Stripe", "PayPal"]
  id:
    type: String

definition =
  github_id: Number
  github_display_name: String
  github_username: String
  github_avatar_url: String
  github_email: String
  github_json: {}
  status: { type: ObjectId, ref: 'Module' }
  
  # determines whether the User has signed merchant agreement or not - allows him to hire people
  merchant: 
    type: Boolean
    default: false
    
  # determines whether the User has signed developer agreement or not
  employee:
    type: Boolean
    default: false 
  
  # group_id - TODO: refactor
  group_id:
    type: String
    enum: ["admin","developer","project manager","client"]
  
  # TODO: clarify how we use this string - we might have multiple hashes from stripe, so probably should do different setup
  payment_methods: 
    type: [PaymentMethod]
    default: []  


methods =
  public_info: ->
    return {@github_id, @has_stripe, @payment_methods, @merchant, @employee, @github_display_name, @github_email, @github_username, @github_avatar_url, is_authenticated: true}

  get_payment_method: (service, callback) ->
    async.detect @payment_methods, (method, async_detect)=>
      async_detect method.service is service
    ,(method)=>
      callback null, method      
  	
statics =
  get_user: (userId, callback)->
    @findOne {github_id: userId}, callback

  get_clientswithpayment: (callback) ->
    @find merchant:true, (error,users) =>
#      console.log users
      async.filter users, (u, cb) =>
        cb u.has_stripe
      ,(results) ->callback(null,results)

virtuals = 
  get : 
    has_stripe: ->
      method = _.find @payment_methods, (method)=>
        return method.service is 'Stripe'
      return if method? then true else false
          
  set: {}


exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics