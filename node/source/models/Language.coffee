###
  Config
###
ObjectId  = require('mongoose').Schema.Types.ObjectId
async     = require 'async'

###
  Models
###
{get_models} = require '../conf'
[Repositories] = get_models ["Module"]

definition =
  name: 
   type: String
   required: true
   unique: true
  
  color: String

statics =
  get_page: (opts..., callback)->
    page_number = parseInt(opts[0]) || 0
    limit       = parseInt(opts[1]) || 30
    
    async.parallel {
      languages: (async_callback)=>
        @find().skip(page_number*limit).limit(limit).sort({name: 1}).exec async_callback
      total_count: (async_callback)=>
        @count async_callback         
    }, callback        
      
  get_siblings: (language, opts..., callback)->
    page_number = parseInt(opts[0]) || 0
    limit       = parseInt(opts[0]) || 30
    switch opts[3]        
      when 'name'  then sort = {module_name: 1}        
      else sort = {stars: -1}
    
    Repositories.find({language}).limit(limit).skip(page_number*limit).sort(sort).exec callback

exports.modelName   = "language_name" 
exports.definition  = definition
exports.statics     = statics