###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
toObjectId   = require('mongoose').mongo.BSONPure.ObjectID.fromString
{get_models} = require '../conf'
async        = require 'async'
_            = require 'underscore'


definition =
  repositories: [{
    _id: ObjectId
    owner: String
    module_name: String
    _processed : 
      type: Boolean
      default: false
  }]
  processed: 
    type: Boolean
    default: false
  left: Number
  

statics =
  update_progress: (snapshot_id, module, callback)->    
    query  = {_id: snapshot_id, "repositories._id" : module._id, "repositories._processed": false }
    update = {"repositories.$._processed": true, $inc : {left: -1}}    
    
    @findOneAndUpdate query, update, (err, snapshot) =>
      #console.log query
      return callback err if err?
      return callback "cant find snapshot" unless snapshot?        

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
      return callback("There was an unprocessed snapshot - continue running previous tasks", snapshot) if snapshot?
      
      @create {repositories: modules, left: modules.length}, callback


exports.statics    = statics
exports.definition = definition