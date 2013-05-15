conf               = require '../conf'
moment             = require "moment"
_                  = require 'underscore'

[Bill, Connection, Runway] = conf.get_models ["Bill", "Connection", "Runway"]

issue_bills = ->
  ###
    Aggregation of runways per week -- able to be called from an internal cron job
  ###
  Connection.find().populate("runways bills").exec((result, connections) ->
    if result then return console.log result

    console.log "[__ connections found __]"
    console.log connections

    connections = _.reduce connections, (result, connection) ->
      # reduce
      if Array.isArray(connection.runways) and connection.runways.length > 0
        result.push connection
      result
      # default
    , []



    _.each(connections, (connection) ->
      amount = 0
      hours = 0
      description = ""

      console.log "[__ runways found __]"
      console.log connection.runways

      _.each(connection.runways, (runway) ->
        amount += runway.worked * (runway.charged + runway.charged * runway.fee / 100)
        hours += runway.worked
        runway.remove()
        description += runway.memo + "\n"
      )

      if amount <= 0 or hours <= 0
        return



      bill = new Bill
        amount: amount
        from_user: connection.reader.id
        to_user: connection.writer.id
        date: Date.now()
        description: description

      console.log "[__ attempting to save bill __]"
      bill.save (result, bill) ->
        console.log result, bill

        connection.bills.push(bill)
        connection.data -= hours
        unless connection.data >= 0
          connection.data = 0
        connection.runways = []
        connection.save()

    )
  )

issue_bills() if require.main is module

###
  Public API
###
module.exports = issue_bills