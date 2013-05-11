collections.Users = Backbone.Collection.extend
  model : models.User
  url : "/session/list"