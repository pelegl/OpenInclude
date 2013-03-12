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
    
    # completion date
    completed: Date
    
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
