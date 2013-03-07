ObjectId = require('mongoose').Schema.Types.ObjectId

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
  payment_methods: [PaymentMethod] 
    

methods =
  public_info: ->
    return {@github_id, @merchant, @employee, @github_display_name, @github_email, @github_username, @github_avatar_url, is_authenticated: true}

statics =
  get_user: (userId, callback)->
    @findOne {github_id: userId}, callback 


exports.definition = definition
exports.methods = methods
exports.statics = statics
