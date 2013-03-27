models.StackOverflowQuestion = Backbone.Model.extend
  idAttribute: "_id"
  urlRoot: "/modules"
  url: ->
    return "#{@urlRoot}/all/all/stackoverflow/json/#{@get('_id')}"

  date: ->
    return new Date @get("timestamp")*1000

  x: ->
    return @get("timestamp")*1000

  y: ->
    return @get "amount"