{get_models,esClient} = require '../conf'

[Stripe,User,Bill,Connection] = get_models ["Stripe","User","Bill","Connection"]
basic = require('./basicController')
_ = require "underscore"

class PaymentController extends basic
  constructor: (@req, @res)->
    @context =
      title : "payment" 
    super
  
  index: ->  	
    @context.body = @_view 'payment/index', @context    
    @res.render 'base', @context
  

  test: ->
    User.get_user "261220" ,(err,user) =>
  	  Stripe.billCustomer "513da86c8288483a69000003",user, 1000, (err,billed) ->
			    console.log err
			    console.log billed  
    	
    #adds a customer
  addCustomer:->
#  	if req.user
#  		user = 
	    Stripe.addCustomer '261220',"Tom Hanks","371449635398431","4","2014","222",(err,customer)=>
	    	if not err
	    		console.log customer
	    		@res.send customer
	    		@res.statusCode = 201
	    	else
	    		console.log err
	    		@res.send err
	    		@res.statusCode = 500
	#Bills a customer	
  billCustomer: ->
    Stripe.billCustomer "261220", "500", (err, charge) =>
      if not err
        stripeObj =
          chargeid: charge.id
          date: charge.created
        billed = new Stripe(stripeObj)
        billed.save (error, stripe) =>
          unless error
            @res.send charge
            @res.statusCode = 201
          else
            @res.send error
            @res.statusCode = 500
      else
        @res.send err
        @res.statusCode = 500
		
module.exports = (req,res)->
  new PaymentController req, res

module.exports.charge = (req, res) ->
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