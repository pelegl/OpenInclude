###
  Config
###
{esClient} = require '../conf'
fs         = require 'fs'
###
  Tasks
  TODO: complete the tasks
###

mapping = JSON.parse fs.readFileSync '../../es/config/mappings/mongomodules/module.json', 'utf-8'

esClient.putMapping "mongomodules", "module", mapping, (err, data)->
  console.log err, data