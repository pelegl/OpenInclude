collections.GithubEvents = Backbone.Collection.extend
  model: models.GithubEvent

  initialize: (options={})->
    # init
    {@language, @owner, @repo} = options
    # check
    @language ||= ""
    @repo     ||= ""
    @owner    ||= ""

  url: ->
    return "/modules/#{encodeURIComponent(@language)}/#{@owner}|#{@repo}/github_events/json"