Tasks                 = require './tasks'
{get_models, git}     = require '../source/conf'
[Module, Snapshot]    = get_models ["Module", "Snapshot"]
console               = require('tracer').colorConsole()

init = (fivebeans)->
  
  
  
  
  
  jobs.process 'activity', 20, (job, done)=>
    console.debug "Started processing job: #{job.id}"
    
    # Process jobs here
    {module, snapshot_id} = job.data
    name = "#{module.owner}/#{module.module_name}"
    repo = git.repo name
            
    process = (page)=>      
      repo.events page, (err, response, headers)=>
        console.error err, name
        return done err if err?
        # Check limit
        limit = Tasks.limit headers
        if limit % 50 is 0 then console.info "Current limit: %d", limit
        
        # check pagination
        try
          {next, last} = Tasks.getPageLinks headers.link
        catch e
          console.error e
          return done()  
                          
        return done() unless next?             
        return done("limit") unless limit > 0             
                    
        # report job progress
        total = parseInt last.replace /.*&page=(\d+)/, "$1"
        job.progress page, total
        # process next 
        process parseInt next.replace /.*&page=(\d+)/, "$1"
                
      
    process(1)


module.exports = init