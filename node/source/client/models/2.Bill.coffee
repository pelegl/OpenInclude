models.Bill = Backbone.Model.extend
  idAttribute: "_id"

  url: ->
    return "/api/payment/#{@get('id')}"

  charge: (success, error) ->
    console.log "[__ charge __]", this

    ## updating document
    callback = (data, status, xhr)=>
      success @set(data)

    ## returning error
    callback_error = (model, xhr, options)=>
      error xhr.responseText

    @save {isPaid: true}, {success: callback, error: callback_error, patch: true}
