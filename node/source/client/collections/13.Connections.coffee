collections.Connections = Backbone.Collection.extend
  model: models.Connection
  url: "/api/connection"
