conf               = require '../conf'
moment             = require "moment"
[Bill, Connection] = conf.get_models ["Bill", "Connection"]


module.exports = ->
  ###
    Aggregation of runways per week -- able to be called from an internal cron job
  ###
  Connection.find().populate("runways bills").exec((result, connections) ->
    if result then return console.log result

    connections = _.reduce(connections, (result, connection) ->
      if connection.runways and connection.runways is not []
        result.push connection
      result
    , [])

    _.each(connections, (connection) ->
      amount = 0
      hours = 0
      description = ""
      _.each(connection.runways, (runway) ->
        amount += runway.worked * (runway.charged + runway.charged * runway.fee / 100)
        hours += runway.worked
        runway.remove()
        description += runway.memo + "\n"
      )

      if amount <= 0 or hours <= 0
        return

      bill = new Bill(
        amount: amount
        from_user: connection.reader.id
        to_user: connection.writer.id
        date: Date.now
        description: description
      )
      bill.save((result, bill) ->
        connection.bills.push(bill)
        connection.data -= hours
        unless connection.data >= 0
          connection.data = 0
        connection.runways = []
        connection.save()
      )
    )
  )