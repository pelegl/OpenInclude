###
  Config
###
{Schema}       = require 'mongoose'
{esClient, db} = require '../conf'
async          = require 'async'
fs             = require 'fs'
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

#esClient.createIndex "modules-v3", (err, data)->
#  return console.error err if err?
#  console.log data

module.find (err, modules)->
  return console.error err if err?
  i = 0
  commands = []

  async.forEach modules, (module_data, async_callback)=>

    commands.splice -1, 0, [
      { "index" : { "_index" :'modules-v3', "_type" : "module_v2", _id: module_data._id} }
      {module_name: module_data.module_name, language: module_data.language, owner: module_data.username, description: module_data.description, stars: module_data.watchers}
    ]

    async_callback null
  , =>

    esClient.bulk(commands, {})
      .on('data', (data)=> console.log data     )
      .on('done', (done)=> console.log done     )
      .on('error',(error)=> console.error error )
      .exec()