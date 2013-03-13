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
    client: Object
    
    # Project details
    name : String
    description: String
    
    # whose involved in project
    resources: []
    
    # project tasks
    tasks: [ObjectId]
    
    # completion date
    completed: Date
    
    # access rights to specific tasks
    categories: []
    
    # access rights for project 
    read: []
    write: []
    grant: []
    
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
