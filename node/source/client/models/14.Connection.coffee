models.Connection = Backbone.Model.extend
  idAttribute: "_id"
  url: '/api/connection'

  parse: (connection)->
    bills     = []
    @bill_keys = {}

    _.each connection.bills, (bill)=>
      billModel = new models.Bill(bill)
      bills.push billModel
      @bill_keys[billModel.get("id")] = billModel

    connection.bills = bills

    connection

  toJSON: (options)->
    attributes = _.clone @attributes
    attributes.bills = _.map attributes.bills, (bill)-> return bill.toJSON(options)

    attributes

  get_bill: (id)->
    return @bill_keys[id]
