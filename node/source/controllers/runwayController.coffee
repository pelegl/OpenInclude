get_models = require('../conf').get_models
moment = require 'moment'

[Runway] = get_models ["Runway"]

module.exports =
  connections: (req, res) ->
    Runway.find((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json data
    )

  create: (req, res) ->
    req.body.writer = {id: req.body.writer_id, name: req.body.writer}
    req.body.reader = {id: req.body.reader_id, name: req.body.reader}
    runway = new Runway(req.body)

    runway.save((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json({success: true})
    )