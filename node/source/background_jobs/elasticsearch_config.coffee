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

###
  modules_v2 mapping
###
mapping =
  modules_v2:
    _all :
      enabled: false
    properties:
      stars:
        type: "string"
      description:
        analyzer: "snowball"
        type: "string"
      owner:
        analyzer: "suggest_analyzer"
        type: "string"
      language:
        type: "string"
      source_files:
        properties:
          file_name:
            type: "string"
        comments:
          analyzer: "snowball"
          type: "string"
        file_type:
          type: "string"
      module_name:
        analyzer: "suggest_analyzer"
        type: "string"

###
esClient.createIndex "modules-v3", (err, data)->
  return console.error err if err?
  console.log data

  esClient.putMapping "modules-v3", "modules_v2", mapping, (err, data)->
    console.error if err?
    console.log data

###


module.find().lean().exec (err, modules)->
  return console.error err if err?
  i = 0
  commands = []

  console.log "Modules found : #{modules.length}"

  async.forEach modules, (module_data, async_callback)=>

    {module_name, language, watchers, username, description} = module_data
    commands.splice -1, 0, { "index" : { "_index" :'modules-v3', "_type" : "module_v2", _id: module_data._id} }, {module_name, language, owner: username, description, stars: watchers}

    async_callback null
  , =>

    console.log "Bulk commands - #{commands.length}"

    esClient.bulk(commands, {})
      .on('data', (data)=> console.log data     )
      .on('done', (done)=> console.log done     )
      .on('error',(error)=> console.error error )
      .exec()