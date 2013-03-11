Tasks         = require './tasks'
async         = require 'async'
{get_models}  = require '../source/conf'
console = require('tracer').colorConsole()

[Snapshot] = get_models ["Snapshot"]

init = (jobs, Job, callback)->
  workflow = {}
  workflow.modules = Tasks.call 'repositories', 1
  
  workflow.jobs = ['modules', (callback, data)->
    Snapshot.snapshot_make data.modules.modules, callback
  ]
  
  workflow.processSnapshot = ['jobs', (callback, data)->
    snapshot = data.jobs
    
    console.debug snapshot
    
    async.forEach snapshot.repositories, (repository, async_callback)=>
      jobs.create( 'activity', {snapshot_id: snapshot._id, module: repository} ).attempts(25).save()
      async_callback()
    ,callback      
  ]
  
  async.auto workflow, (err, results)=>
    console.error err if err?
    console.info "Total modules returned: #{results.modules.total}"
    callback()



module.exports = init
