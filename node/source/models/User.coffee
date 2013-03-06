ObjectId = require('mongoose').Schema.Types.ObjectId

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
  
  

methods =
  public_info: ->
    return {@github_id, @merchant, @employee, @github_display_name, @github_email, @github_username, @github_avatar_url, is_authenticated: true}

exports.definition = definition
exports.methods = methods
