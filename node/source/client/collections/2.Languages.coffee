collections.Language = collections.requestPager.extend

  comparator: (language)->
    return language.get("name")

  model: models.Language

  url: "/modules"

  parse: (response)->
    @cache[@currentPage] = languages = response.languages
    @totalRecords = response.total_count
    languages