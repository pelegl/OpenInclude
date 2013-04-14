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
    @res.render 'base', @context

  _searchOutput: (savedData) ->    
    data = JSON.parse(savedData.join "")           
    if data.hits
      maxScore = data.hits.max_score  
      output = data.hits.hits
    else
      output = []

    console.log output.length
    
    ###
      Process output ---
      1. Add colors to the languages
      2. Add number of questions asked/answered on stackoverflow
    ###
    languages = {}
    module_ids   = []
    score = {}

    async.forEach output, (repository, callback) =>
      {_id} = repository._source
      module_ids.push _id
      score[_id] = repository._score
      callback null
    , =>      
      workflow = {}

      workflow.modules = (callback)=>
        console.log module_ids

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
          fields: ["module_name^2", "owner", "description"]
          use_dis_max: true
          tie_breaker: 0.7
          boost: 1.2
    else
      query =
        match_all: {}


    console.log JSON.stringify(query)


    options =
      size: 80
    

    savedData = []
    esClient.search('mongomodules', 'module', {query}, options)
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
