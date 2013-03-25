###
  Config
###
ObjectId  = require('mongoose').Schema.Types.ObjectId
async     = require 'async'
_         = require 'underscore'
###
  Definition
   creator of bills,
   amount,
   date,
   and who is to be billed
###

definition =
  amount: Number #in dollars
  user: { type: ObjectId, ref: 'User' }
  description: String  # The Description
  isPaid:
    type: Boolean
    default: false
  stripe: {type: ObjectId, ref: 'Stripe'}

statics =
	get_bills:(userid, callback)->
  		@find({user: userid}).lean().exec callback

exports.definition  = definition
#exports.methods     = methods
exports.statics     = statics