###
  Config
###
ObjectId  = require('mongoose').Schema.Types.ObjectId
async     = require 'async'
_         = require 'underscore'
###
  Definition
###

definition =
  task: ObjectId
  start: Number
  logged: Number
  who: Object

methods = {}

statics = {}

virtuals =
  get: {}
  set: {}

exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
