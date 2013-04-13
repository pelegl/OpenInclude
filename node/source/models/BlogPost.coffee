###
  Config
###
ObjectId  = require('mongoose').Schema.Types.ObjectId
async     = require 'async'
_         = require 'underscore'
marked = require "marked"
###
  Definition
###

definition =
  date:
    type: Date
    default: new Date()

  title: String
  content: String
  publish: Boolean

methods = {}

statics = {}

virtuals =
  get:
    htmlContent: ->
      marked(@content)
  set: {}

exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
