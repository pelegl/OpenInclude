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
  bill_id: String
  bill_amount: Number
  bill_date:
    type: Date
    default: new Date
  bill_to_whome: { type: ObjectId, ref: 'User' }
  bill_description: String  # The Description
  isPaid:
    type: Boolean
    default: false
  
  
methods =
  public_info: ->
    return {@bill_id, @bill_amount, @bill_date, @bill_to_whome, @bill_description}
  
statics =
	get_bills:(userid, callback)->
  		@find {bill_to_whome:userid}, callback

exports.definition  = definition
exports.methods     = methods
exports.statics     = statics