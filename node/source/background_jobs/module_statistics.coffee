###
  Config
###
async = require 'async'
{get_models} = require '../conf'

[Module, StackOverflow] = get_models ["Module", "StackOverflow"]


###
  Task
###
Workflow = {}

Workflow.ids = (callback) ->
  console.log "[__ids started__]"
  Module.find {}, "_id", callback

Workflow.statistics = ['ids', (callback, results)->
  console.log "[__statistics started__]"
  {ids} = results
  toParse = ids.length
  parsed = 0
  async.map ids, (module_data, async_callback)->
    StackOverflow.questionsStatistics [module_data._id], (err, data)=>
      [data] = data
      data = {_id: module_data._id, asked: 0, answered: 0} unless data?

      console.log "#{++parsed}/#{toParse}", data
      async_callback err, data
  , callback
]

Workflow.update = ['statistics', (callback, results)->
  console.log "[__updater started__]"
  {statistics} = results
  async.forEach statistics, (module, async_callback)=>
    {_id, asked, answered} = module
    Module.update {_id}, {so_questions_asked: asked, so_questions_answered: answered}, async_callback
  , callback
]



exports.run = ()->
  console.log "Statistics update job started"
  async.auto Workflow, (err)->
    return console.error err if err?
    console.log "Successfully completed statistics update job"