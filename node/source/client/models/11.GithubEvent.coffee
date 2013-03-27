models.GithubEvent = Backbone.Model.extend
  idAttribute: "_id"
  urlRoot: "/modules"
  url: ->
    return "#{@urlRoot}/all/all/github_events/json/#{@get('_id')}"

  x: ->
    return new Date @get("created_at")