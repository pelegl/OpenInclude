{get_models,esClient} = require '../conf'

[Stripe,User,Bill,Connection] = get_models ["Stripe","User","Bill","Connection"]
basic                         = require('./basicController')
_                             = require "underscore"


exports.patch = (req,res) ->
  {isPaid} = req.body

  return charge(req,res) if isPaid is true

  res.send "Error", 500


# new, charge by bill
exports.charge = charge = (req, res) ->

  Bill.findById(req.params.id).populate("from_user to_user").exec (err, bill) ->
    return res.json {success: false, error: err}, 400 if err or !bill
    return res.json {success: false, error: "Bill was already paid"}, 400 if bill.isPaid

    Stripe.billCustomer bill, (err, charge) ->
      if not err

        stripeObj =
          chargeid: charge.id
          date: charge.created

        billed = new Stripe(stripeObj)
        billed.save (error, stripe) =>
          unless error
            # switch back to ids, so we dont expose sensetive information to the client
            charge.from_user = charge.populated('from_user')
            charge.to_user   = charge.populated('to_user')
            # send charge details back
            res.send charge
            res.statusCode = 201
          else
            res.send error
            res.statusCode = 500
      else
        res.send err
        res.statusCode = 500

# deprecated, used for direct charging connections
exports.charge2 = (req, res) ->
  Connection.findById(req.body.id).populate("runways").exec((result, connection) ->
    if result then return res.json {success: false, error: "Connection not found"}

    amount = 0
    _.each(connection.runways, (runway) ->
      amount += runway.worked * (runway.charged + runway.charged * runway.fee / 100)
    )

    if amount is 0
      return res.json {success: true}

    User.find({ $or: [ {_id: connection.reader.id}, {_id: connection.writer.id} ] }, (result, users) ->
      if result then return res.json {success: false, error: "Users from connection are not valid"}

      Stripe.billCustomer users[1], users[0], amount, (err, charge) ->
        if not err
          stripeObj =
            chargeid: charge.id
            date: charge.created
          billed = new Stripe(stripeObj)
          billed.save (error, stripe) =>
            unless error
              res.send charge
              res.statusCode = 201
            else
              res.send error
              res.statusCode = 500

          _.each(connection.runways, (runway) ->
            runway.paid = true
            runway.save()
          )
        else
          res.send err
          res.statusCode = 500
    )
  )