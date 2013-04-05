get_models = require('../conf').get_models
moment = require 'moment'

[Runway, Connection] = get_models ["Runway", "Connection"]

search = (req, res) ->
  query = Runway.find()

  unless req.params.from is "none"
    query.where("due").gte(moment(req.params.from, "X").toDate())

  unless req.params.to is "none"
    query.where("due").lte(moment(req.params.to, "X").toDate())

  query.exec(
    (result, data) ->
      if result then return res.json success: false, error: result
      res.json data
  )

module.exports =
  connections: (req, res) ->
    Connection.find((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json data
    )

  create_connection: (req, res) ->
    req.body.writer = {id: req.body.writer_id, name: req.body.writer}
    req.body.reader = {id: req.body.reader_id, name: req.body.reader}
    connection = new Connection(req.body)

    connection.save((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json({success: true})
    )

  reader: (req, res) ->
    Connection.find({"reader.id": "" + req.user._id}).populate("runways").exec((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json data
    )

  writer: (req, res) ->
    Connection.find({"writer.id": "" + req.user._id}).populate("runways").exec((result, data) ->
      if result
        res.json({success: false, error: result})
      else
        res.json data
    )

  create: (req, res) ->
    Connection.findById(req.params.connection, (result, connection) ->
      if result
        res.json {success: false, error: result}
      else
        runway = new Runway(
          date: new Date()
          worked: req.body.worked
          charged: connection.charged
          fee: connection.fee
          memo: req.body.memo
          connection: connection._id
        )

        runway.save((result, runway) ->
          if result
            res.json {success: false, error: result}
          else
            connection.runways.push(runway)
            connection.save()

            res.json {success: true}
        )
    )

  search_reader: (req, res) ->
    search(req, res, 1)

  search_writer: (req, res) ->
    search(req, res, 2)