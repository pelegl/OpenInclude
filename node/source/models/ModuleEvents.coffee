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
  ###
    @function
    creates events for the given module
  ###
  publish: (module_id, event_data, callback)->
    # morph into array if its not
    event_data = [event_data] unless Array.isArray event_data
    # map module_id into payload
    async.map event_data, (event, async_call)=>      
      payload           = event
      payload.module_id = module_id
      async_call null, payload
    ,(err, modules)=>
      # batch create modules
      @create modules, (err) =>
        # not interested in validation errors
        callback null
    
  pull_for_module: (stopTS, module_id, callback)->
    date = new Date stopTS
    @find({module_id, created_at: {$gt: date}}, "type created_at module_id").sort({created_at: 1}).exec callback
      
    
index = [ 
  [{module_id : 1, id: 1}, {unique: true}],
  [{module_id : 1, created_at: 1}]
]

exports.index      = index
exports.statics    = statics
exports.definition = definition