ObjectId = require('mongoose').Schema.Types.ObjectId

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
    @find().skip(page_number*limit).limit(limit).sort({name: 1}).exec callback
      
  get_siblings: (language, opts..., callback)->
    page_number = parseInt(opts[0]) || 0
    limit       = parseInt(opts[0]) || 30
    switch opts[3]        
      when 'name'  then sort = {module_name: 1}        
      else sort = {stars: -1}
    
    Repositories.find({language}).limit(limit).skip(page_number*limit).sort(sort).exec callback

exports.definition = definition
#exports.methods = methods