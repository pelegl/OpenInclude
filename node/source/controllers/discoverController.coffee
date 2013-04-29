#### Config
{esClient, model} = require '../conf'
async             = require 'async'
#### Models
[Module, Language, StackOverflow] = model ["Module", "Language", "StackOverflow"]

toObjectId = require('mongoose').mongo.BSONPure.ObjectID.fromString

language_stopwords = []
Language.find (err, languages)->
  throw err if err?
  languages.forEach (language)->
    language_stopwords.push language.name

#### Class
class DiscoverController extends require('./basicController') 
  constructor: (@req, @res)->
    
    @context =
      discover_search_action : "/discover"
      
    {q} = @req.query
    @context.discover_search_query = decodeURIComponent q if q?
    
    super
  
  index: ->
    @context.body = @_view 'discover/index', @context
    @context.title = "Open Include | Discover Open Source Modules"
    @res.render 'base', @context

  _searchOutput: (savedData) ->    
    data = JSON.parse(savedData.join "")           
    if data.hits
      maxScore = data.hits.max_score  
      output = data.hits.hits
    else
      output = []
    
    ###
      Process output ---
      1. Add colors to the languages
      2. Add number of questions asked/answered on stackoverflow
    ###
    languages = {}
    module_ids   = []
    score = {}

    ###
        { _index: 'comments-v2-index',
      _type: 'module_v2',
      _id: '5133d0c6a4c2892c0f000f4c',
      _score: 0.0019432604,
      fields:
       { owner: 'cloudera',
         language: 'Python',
         module_name: 'hue',
         stars: 243,
         description: 'Hue is a browser-based desktop interface for interacting with Hadoop. It supports a file browser, job tracker interface, majors query editors, and more.' } }
    ###

    async.forEach output, (repository, callback) =>
      {_id} = repository
      module_ids.push _id
      score[_id] = repository._score
      callback null
    , =>      
      workflow = {}

      workflow.modules = (callback)=>
        Module.find({_id: {$in: module_ids}}).lean().exec callback

      workflow.languages = (callback)=>
        Module.find({_id: {$in: module_ids}}).distinct "language", (err, language_names)=>
          return callback err if err?
          Language.find {name: {$in: language_names}}, (err, languages)=>
            return callback err if err?
            lang_map = {}
            async.forEach languages, (language, async_callback)=>
              lang_map[language.name] = language; async_callback()
            ,=> callback null, lang_map


      workflow.map = ['modules', 'languages', (callback, results)=>

        {languages, modules} = results

        async.map modules, (module, async_callback)=>
           module.color    = languages[module.language]?.color || "cccccc" #gray for non-specified color
           module._score   = score[module._id.toString()]
           async_callback null, module
        , callback
      ]
      
      async.auto workflow, (err, data)=>
        throw err if err?
        
        output = data.map

        #console.log "output sent", new Date()

        #### Return processed data
        # XHR         
        return @res.json {searchData: output, maxScore} if @req.xhr      
        # Direct request --- ie search engine hit
        @context.searchData = JSON.stringify output
        @context.maxScore   = maxScore
        @index()
       
  

  search: ->

    if @context.discover_search_query.length > 2
      query =
        query_string:
          query: @context.discover_search_query
          fields: ["module_name^2", "owner", "description", "comments"]
          use_dis_max: true
          tie_breaker: 0.7
          boost: 1.2
          default_operator: "AND"

    else
      query =
        match_all: {}

    options =
      size: 80

    fields = []

    savedData = []
    esClient.search('comments-v2-index', 'module_v2', {query, fields, min_score: 0.5}, options)
    .on('data', (data) =>savedData.push data)
    .on('done', =>@_searchOutput savedData)
    .on('error', (error)=>
      console.error error

      if @req.xhr      
        @res.json error, 500
      else
        @context.searchError = true
        @index()
    )
    .exec()

module.exports = (req,res)->
  new DiscoverController req, res
