views.NotFound = Backbone.View.extend
  className: "error-404"
  render: ->
    @$el.html "Error 404 - not found"
    @