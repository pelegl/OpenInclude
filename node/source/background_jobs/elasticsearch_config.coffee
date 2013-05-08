###
  Config
###
{Schema}       = require 'mongoose'
{esClient, db} = require '../conf'
fs         = require 'fs'
###
  Tasks
  TODO: complete the tasks
###

#mapping = JSON.parse fs.readFileSync '../../es/config/mappings/mongomodules/module.json', 'utf-8'

###
esClient.createIndex "mongomodules", (err, data)->
  console.log err, data
  esClient.putMapping "mongomodules", "module", mapping, (err, data)->
    console.log err, data
###

module = db.model 'modules2', new Schema({}), 'modules2'

esClient.createIndex "modules-v3", (err, data)->
  return console.error err if err?
  console.log data

  module.find (err, modules)->
    return console.error err if err?
    i = 0
    commands = []

    async.forEach modules, (module, async_callback)=>
      commands.push { "index" : { "_index" :'modules-v3', "_type" : "module_v2", _id: module._id} }
      commands.push {module_name: module.module_name, language: module.language, owner: module.username, description: module.description, stars: module.watchers}
      async_callback null
    , =>

      esClient.bulk(commands, {})
        .on('data', (data)=> console.log data     )
        .on('done', (done)=> console.log done     )
        .on('error',(error)=> console.error error )
        .exec()