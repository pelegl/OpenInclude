###
  Config
###
require 'coffee-trace'
####
cluster         = require 'cluster'
fivebeans       = require 'fivebeans'
NumberOfWorkers = 2
{spawn, exec} = require 'child_process'

###
  Start cluster for parallel processing
###
if cluster.isMaster
  # compile handlers
  coffee = spawn '/usr/bin/coffee', ['-c', '-b', '-o', 'handlers', 'source']
  coffee.on 'close', ->
    # set tasks
    require('./setTasks') fivebeans, (callback)->
      # start workers
      cluster.fork() for [0...NumberOfWorkers]        
else      
  console.log "Starting workers"
  runner = new fivebeans.runner "Queue_worker_#{cluster.worker.id}", './worker_config.yml'    
  runner.go()