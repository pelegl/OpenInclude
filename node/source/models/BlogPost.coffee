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
  author: Object

  date:
    type: Date
    default: Date.now

  title: String
  content: String
  publish: Boolean
  tags: [String]

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
