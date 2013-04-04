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
  reader: Object
  writer: Object
  charged: Number
  fee: Number
  data: Number


methods = {}

statics = {}

virtuals =
  get: {}
  set: {}

exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
