###
  Config
###
cluster   = require 'cluster'
kue       = require 'kue'
jobs      = kue.createQueue()
Job       = kue.Job

###
  Start cluster for parallel processing
###
if cluster.isMaster
  #kue.app.listen 3000
  startTime = new Date().getTime()/1000  
  require('./setTasks') jobs, Job, (callback)->
    # forking now
    stopTime = new Date().getTime()/1000  
    console.log "Settings tasks took: #{stopTime-startTime} seconds"  
    cluster.fork() for i in [0...2]    
  
  cluster.on 'exit', (worker, code, signal)->
    console.log "worker #{worker.process.pid} died"
   
else
  console.log "Worked started", cluster.worker
  require('./processTasks') jobs, Job
  