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
  connection:
    type: ObjectId
    ref: "Connection"
  date: Date
  worked: Number
  charged: Number
  fee: Number
  memo: String
  paid: Boolean

methods = {}

statics = {}

virtuals =
  get: {}
  set: {}

exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
