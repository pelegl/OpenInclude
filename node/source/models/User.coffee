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
  
  trello_id: String
  trello_token: String
  trello_token_secret: String
  
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
    enum: ["admin", "reader", "writer"]

  groups: [String]

  payment_methods:
    type: [PaymentMethod]
    default: []  


methods =
  information: ->
    return {@github_id, @github_display_name, @github_username, @github_avatar_url, @_id, @github_email}

  public_info: ->
    return {@github_id, @group_id, @groups, @has_stripe, @payment_methods, @merchant, @employee, @github_display_name, @github_email, @github_username, @github_avatar_url, @trello_id, @_id, is_authenticated: true}

  get_payment_method: (service, callback) ->
    async.detect @payment_methods, (method, async_detect)=>
      async_detect method.service is service
    ,(method)=>
      callback null, method

  is_superuser: ->
    return @group_id is 'admin'
  	
statics =
  get_user: (userId, callback)->
    @findOne {github_id: userId}, callback

  getUserByName: (username, callback)->
    @findOne {github_username: username}, callback

  getClientsWithStripe: (callback) ->
    @find {"payment_methods.service" : "Stripe"}, "github_id github_display_name github_username github_avatar_url github_email", callback

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
