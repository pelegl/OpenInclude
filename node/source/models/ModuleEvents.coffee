###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models} = require '../conf'
async        = require 'async'
_            = require 'underscore'

[Module] = get_models ["Module"]


###
  Definition
###

definition =
  module_id: {type: ObjectId, ref: "Module"}
  type: String
  public: Boolean
  payload: {}
  repo: {}
  actor: {}
  org: {}
  created_at: Date
  id: Number  
  

statics =
  publish: (module_id, event_data, callback)->
    async.forEach event_data, (event, async_call)=>      
      payload           = event
      payload.module_id = module_id
      @create payload, =>
        #not intereseted in errors, duplicate key errors are intended
        async_call()
    ,callback
    
    
index = [ 
  [{module_id : 1, id: 1}, {unique: true}]
]

exports.index      = index
exports.statics    = statics
exports.definition = definition