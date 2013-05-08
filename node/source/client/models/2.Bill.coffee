models.Bill = Backbone.Model.extend
  idAttribute: "_id"

  url: ->
    return "/api/payment/#{@get('id')}"

  charge: (success, error) ->
    #console.log "[__ charge __]", this

    ## updating document
    callback = (model, response, options)=>
      @set response
      success()

    ## returning error
    callback_error = (model, xhr, options)=>
      error xhr.responseText

    @save {isPaid: true}, {success: callback, error: callback_error, patch: true}
