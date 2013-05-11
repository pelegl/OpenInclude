collections.Modules = collections.requestPager.extend
  initialize: (models, options)->
    @language = options.language || ""

  comparator: (module)->
    return module.get("watchers")

  model: models.Repo

  url: ->
    return "/modules/#{encodeURIComponent(@language)}"

  parse: (response)->
    @cache[@currentPage] = modules = response.modules
    @totalRecords = response.total_count
    modules