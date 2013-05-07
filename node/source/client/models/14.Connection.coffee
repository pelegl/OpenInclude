models.Connection = Backbone.Model.extend
  idAttribute: "_id"
  url: '/api/connection'

  parse: (connection)->
    bills     = []

    _.each connection.bills, (bill)=>
      billModel = new models.Bill(bill)
      bills.push billModel

    connection.bills = bills
    connection

  toJSON: (options)->
    attributes = _.clone @attributes
    attributes.bills = _.map attributes.bills, (bill)-> return bill.toJSON(options)
    attributes

  get_bill: (id)->
    return _.findWhere @get("bills"), {id}