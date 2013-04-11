collections.Bills = Backbone.Collection.extend
  model: models.Bill
  urlRoot: "/profile/bills2"
  initialize: (models=[], options={})->
    @options = options

  url: ->
    return "#{@urlRoot}" unless @options.user
    return "#{@urlRoot}/for/#{@options.user.get('github_username')}"

  comparator: (bill) ->
    return -bill.get("_id").getTimestamp()