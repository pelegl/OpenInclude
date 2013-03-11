Tasks                 = require './tasks'
{get_models, git}          = require '../source/conf'
[Module, Snapshot]    = get_models ["Module", "Snapshot"]

init = (jobs, Job)->

  jobs.on 'job complete', (id)=>
    Job.get id, (err, job)=>
      return if err 
      job.remove (err)=>
        throw err if err?
        console.log 'removed completed job #%d', job.id

  
  jobs.promote()
  
  jobs.process 'activity', 20, (job, done)=>
    # Process jobs here
    {module, snapshot_id} = job.data
    name = "#{module.owner}/#{module.module_name}"
    repo = git.repo name
            
    process = (page)=>
      job.log "#{name}: processing page %d", page    
      repo.events page, (err, response, headers)=>
        
        done err if err?
        {next, last} = Tasks.getPageLinks headers.link
        
        return done() unless next?
                
        process parseInt next.replace /.*&page=(\d+)/, "$1"
                
      
    process(1)


module.exports = init