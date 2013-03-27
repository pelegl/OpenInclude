models.Repo     = Backbone.Model.extend
  idAttribute: "_id"
  urlRoot: "/modules"
  url: ->
    return "#{@urlRoot}/#{@get('language')}/#{@get('owner')}|#{@get('module_name')}"