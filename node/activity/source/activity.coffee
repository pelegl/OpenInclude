Tasks                 = require '../tasks'
{get_models, git}     = require '../../source/conf'
[Module, Snapshot, Events]    = get_models ["Module", "Snapshot", "ModuleEvents"]
console               = require('tracer').colorConsole()
async                 = require 'async'
EventEmitter2         = require('eventemitter2').EventEmitter2
util                  = require 'util'
hour = 60*60


class ActivityHandler extends EventEmitter2
  constructor: ->
    @type = 'activity'
    @on 'success', @success
    @on 'release', @release
    @on 'bury'   , @bury
    @on 'error'  , @error
  
  success: (data, callback) ->
    {snapshot_id, module} = data
    Snapshot.update_progress snapshot_id, module, (err, to_process)=>      
      return @emit 'error', err, callback if err?
      # logger
      @logger.info "items left to process #{to_process}"
      # success - remove
      callback 'success'     
              
      
  
  release: (delay, callback) ->
    @logger.info "Limit reached - delaying task"
    callback 'release', delay
    
  bury: (callback) ->
    callback 'bury'
    
  error: (err, callback) ->
    callback err
  
  ###
  work(jobdata, callback(action, delay))

  jobdata: job payload
  action: 'success' | 'release' | 'bury' | custom error message
  delay: time to delay if the job is released; otherwise unused
  ###
  work : (payload, callback)->
    #@logger.info util.inspect(payload, false, null)
                      
    {module, snapshot_id} = payload      
    name = "#{module.owner}/#{module.module_name}"      
    repo = git.repo name
    
    @logger.info "Processing #{name}"    
    process = (page)=>            
      repo.events page, (err, response, headers)=>          
        return @emit('error', err, callback) if err?
        # Check limit
        limit = Tasks.limit headers
        if limit % 50 is 0 then console.info "Current limit: %d", limit
        
        ###
          Process events here
        ###
        Events.publish module._id, response, (err)=>
          return @emit('error', err, callback) if err?
          # check pagination
          try
            {next, last} = Tasks.getPageLinks headers.link
            console.log next, last
          catch e
            @logger.error e
            return @emit 'success', payload, callback
                            
          return @emit('success', payload, callback) unless next?             
          return @emit("release", hour, callback) unless limit > 0             
                               
          process parseInt next.replace /.*&page=(\d+)/, "$1"
    
    Snapshot.findOne {_id: snapshot_id, processed: false}, "_id", (err, snapshot)=>
      return @emit 'error', 'no snapshot', callback unless snapshot
      git.limit (err, left, max)=>        
        return @emit("release", hour, callback) if left <= 0 or err?.message is 'Client rate_limit error'
        return @emit('error', err, callback) if err?         
        process(1)     
  

module.exports = (logger) -> 
 handler = new ActivityHandler()
 if logger then handler.logger = logger
 handler