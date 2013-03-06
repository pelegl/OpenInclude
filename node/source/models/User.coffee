ObjectId = require('mongoose').Schema.Types.ObjectId

definition =
  github_id: Number
  github_display_name: String
  github_username: String
  github_avatar_url: String
  status: { type: ObjectId, ref: 'Module' }
  group_id: {type:String, enum:["admin","developer","project manager","client"]}
  payment_methods: String
methods =
  public_info: ->
    return {@github_id, @github_display_name, @github_username, @github_avatar_url, is_authenticated: true}
    
  hello: () ->
    return "Hello, #{@github_username}!"
    
statics =
  get_user: (userId, callback)->
    @findOne {github_id: userId}, callback 
    
exports.definition = definition
exports.methods = methods
exports.statics = statics