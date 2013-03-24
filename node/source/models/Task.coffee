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
    project: ObjectId
    
    # Task details
    name : String
    description: String
    person: Object
    status: String
    label: String
    due: Date
    logged:
      type: Number
      default: 0
    duration: Number
    price: Number
    
    # completion date
    completed: Date

    # comments thread
    comments: []
    
    # Trello ID
    trello_id : String

methods = {}
        
statics = {}        

virtuals =
    get: {}
    set: {}

exports.virtuals    = virtuals
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
