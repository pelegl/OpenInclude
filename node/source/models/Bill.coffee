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
  bill_id: Number
  bill_amount: Number
  bill_date: Date
  billing_user: { type: ObjectId, ref: 'User' } # Creator of bill
  billed_user: { type: ObjectId, ref: 'User' }  # who is to be billed
  
  
methods =
  public_info: ->
    return {@bill_id, @bill_amount, @bill_date, @billing_user, @billed_user}
  
statics =
###
 Returns Bills of a user
###  
  get_bills:(userid, callback) ->
    @find billed_user:userid ,(err,bills) ->
 	  return callback(err,bills)

	 
exports.definition  = definition
exports.methods     = methods
exports.statics     = statics
