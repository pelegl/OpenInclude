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
  module_v2:
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


esClient.createIndex "modules-v3", (err, data)->
  return console.error err if err?
  console.log data

  esClient.putMapping "modules-v3", "module_v2", mapping, (err, data)->
    console.error if err?
    console.log data

    module.find().lean().exec (err, modules)->
      return console.error err if err?
      i = 0
      commands = []

      console.log "Modules found : #{modules.length}"

      async.forEach modules, (module_data, async_callback)=>

        {module_name, language, watchers, username, description} = module_data
        data = {module_name, language, owner: username, description, stars: watchers}

        esClient.index 'modules-v3', 'module_v2', data, module_data._id.toString(), async_callback

      , (err) =>
        console.log err if err?
        console.log "finished"

