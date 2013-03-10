Tasks         = require './tasks'
async         = require 'async'
{get_models}  = require '../source/conf'


[Snapshot] = get_models ["Snapshot"]

init = (jobs, Job, callback)->
  workflow = {}
  workflow.modules = Tasks.call 'repositories'
  
  workflow.jobs = ['modules', (callback, data)->
    Snapshot.snapshot_make data.modules.modules, callback
  ]
  
  workflow.processSnapshot = ['jobs', (callback, data)->
    snapshot = data.jobs
    async.forEach snapshot.repositories, (repository, async_callback)=>
      jobs.create( 'stargazer', {snapshot_id: snapshot._id, module: repository} ).attempts(25).save()      
  ]
  
  async.auto workflow, (err, results)=>
    console.log err if err?
    console.log "Total modules returned: #{results.modules.total}"
    callback()    



module.exports = init
