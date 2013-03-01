ObjectId = require('mongoose').Schema.Types.ObjectId

definition =
  username: String
  description: String
  pushed: Date
  owner: String
  is_a_fork: Boolean
  watchers: Number
  language: String
  created: Date
  pushed_at: Date
  followers: Number
  module_name: String
  openinclude_followers: [{type: ObjectId, ref: 'User'}]

statics =
  get_module: (name, callback)->
    @findOne {module_name: name}, callback 


exports.definition = definition
exports.statics = statics

