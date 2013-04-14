###
  Config
###
{esClient} = require '../conf'

###
  Tasks
  TODO: complete the tasks
###

mapping =
  module:
    properties:
      description:
        type: "string"
      module_name:
        type: "string"
      owner:
        type: "string"

esClient.putMapping "mongomodules", "module", mapping, (err, data)->
  console.log err, data