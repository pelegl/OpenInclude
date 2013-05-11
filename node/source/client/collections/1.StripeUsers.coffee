collections.UsersWithStripe = Backbone.Collection.extend
  model: models.User
  url: "/session/users_with_stripe"

  parse: (response)->
    {success, err, users} = response
    return [] unless success is true

    users

  initialize: ->
    @fetch()