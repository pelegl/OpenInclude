models.Bill = Backbone.Model.extend
  ###
   user
   amount
   description
  ###
  idAttribute: "_id"
  urlRoot:     "/profile/bills"
  validate: (attrs, options)->
    errors = []
    unless attrs.bill
      errors.push "Internal error - error 001"
    else
      # user
      unless attrs.bill.user
        errors.push "Missing user information - error 002"
      # amount
      unless attrs.bill.amount
        errors.push {name: "amount", msg: "Please, specify amount"}
      else if ! /^[0-9]+(\.[0-9]+)?\$?$/.test attrs.bill.amount
        errors.push {name: "amount", msg: "Amount should only contain digits and a dot"}
      # description
      unless attrs.bill.description
        errors.push {name: "description", msg: "Please, specify bill description"}

    return errors if errors.length > 0