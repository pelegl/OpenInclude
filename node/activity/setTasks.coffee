Tasks         = require './tasks'
async         = require 'async'
{get_models}  = require '../source/conf'
console       = require('tracer').colorConsole()

[Snapshot] = get_models ["Snapshot"]

hour = 60*60
five_minutes = 60*5
Activity_Tube = 'ActivityTube'

init = (fivebeans, callback)->
  # workflow
  workflow = {}
  # setting client
  workflow.activity_client  = (call_client)=>
    client = new fivebeans.client()
    client.connect (err) =>
      return call_client err if err?      
      client.use Activity_Tube, (err, tubename)=>
        return call_client err if err?
        # return client and tubename        
        call_client null, {client, tubename}
    
      
  workflow.modules = Tasks.call 'repositories'
  
  workflow.jobs = ['modules', (workflow_callback, data)->    
    Snapshot.snapshot_make data.modules.modules, workflow_callback
  ]
  
  workflow.processSnapshot = ['activity_client', 'jobs', (workflow_callback, data)->
    snapshot = data.jobs
    {client} = data.activity_client
    console.log "Rpositories returned: #{snapshot.repositories.length}"
    async.forEach snapshot.repositories, (repository, async_callback)=>
      #jobs.create( 'activity', {title: "Scraping github events for #{repository.owner}/#{repository.module_name}", snapshot_id: snapshot._id, module: repository} ).save()
      ###
        Submit a job
        client.put(priority, delay, ttr, payload, function(err, jobid) {});
        -- priority - small is higher
        -- delay in seconds
        -- payload : JSON.stringify
          -- array
          -- [0] tubename
          -- [1] {type: '', payload: ''}
      ###
      
      job =
        type: 'activity'
        payload:
          snapshot_id: snapshot._id
          module     : repository
          
      payload = JSON.stringify [Activity_Tube, job]
      client.put 10, 0, five_minutes, payload
      async_callback()
                          
    ,workflow_callback
  ]
  
  async.auto workflow, (err, results)=>
    if err?
      console.error err
      try
        results.activity_client.kick 10000
      catch e
        console.log e 
    
    console.info "Total modules returned: #{results.modules.total}"
    callback()
  

module.exports = init
