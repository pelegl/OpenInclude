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

exports.definition = definition
exports.methods = methods

