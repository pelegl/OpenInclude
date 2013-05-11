# ModuleStargazers

###
  Config
###
{ObjectId}   = require('mongoose').Schema.Types
{get_models, git} = require '../conf'
async        = require 'async'
_            = require 'underscore'

[Module] = get_models ["Module"]


###
  Definition
###

definition =
  # module relation
  module_id           : {type: ObjectId, ref: 'Module'}
  # unique identification
  login               : String
  snapshot_date       : Date
  
  id                  : String
  type                : String
  
  
statics =
  create: (module_id, snapshot_date, payload, callback) ->
    # assemble payload
    data                = _.extend {}, payload
    data.module_id      = module_id
    data.snapshot_date  = snapshot_date
    # create objecgt
        
    stargazer = new @ data
    # save object
    
    stargazer.save (err) =>
      console.error err if err?
      callback null #we dont want errors here unless database connection dropped, which is highly unlikely    

index = [ 
  [{snapshot_date : 1, login: 1}, {unique: true}]
]

exports.statics    = statics
exports.index      = index
exports.definition = definition
