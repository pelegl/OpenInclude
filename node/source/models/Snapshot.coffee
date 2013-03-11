###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models} = require '../conf'
async        = require 'async'
_            = require 'underscore'


definition =
  snapshot_date : 
    type: Date
    default: new Date
  repositories: []
  processed: 
    type: Boolean
    default: false
  left: Number
  

statics =
  update_progress: (snapshot_id, module, callback)->
    @findOneAndUpdate {_id: snapshot_id, "repositories._id" : module._id, "repositories._processed": {$ne: true} }, #select query
      {"repositories.$._processed": true, $inc : {left: -1}}, #update query
      (err, snapshot) =>
        unless snapshot.left > 0
          snapshot.processed = true
          snapshot.save (err)=>
            return callback err if err?
            callback null, 0
        else
          callback null, snapshot.left 
      
 
  snapshot_make : (modules, callback)->
    @findOne {processed: false}, (err, snapshot)=>
      return callback err if err?
      return callback "unprocessed", snapshot
      
      @create {repositories: modules, left: modules.length}, callback


exports.statics    = statics
exports.definition = definition