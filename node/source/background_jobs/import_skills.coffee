{db, get_models}    = require '../conf'
request             = require 'request'
async               = require 'async'

[Skill] = get_models ["Skill"]


request 'http://www.odesk.com/api/profiles/v1/metadata/skills.json', (err, response, body)->
  return console.error err if err?

  {skills} = JSON.parse body

  async.forEach skills, (skill, async_callback)->
    Skill.create {_id: skill}, async_callback
  , (err)=>
    console.error err if err?
    console.log "End of import"
    process.exit 0