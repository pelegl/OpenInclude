#### Config
{esClient, model} = require '../conf'
async             = require 'async'
#### Models
[Language, StackOverflow] = model ["Language", "StackOverflow"]

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
    
    ###
      Process output ---
      1. Add colors to the languages
      2. Add number of questions asked/answered on stackoverflow
    ###
    languages = {}
    module_ids   = []

    #console.log "Started processing output", new Date()

    async.forEach output, (repository, callback) =>
      {language, _id} = repository._source
      languages[language] = language
      module_ids.push toObjectId(_id)
      callback null
    , =>      
      workflow = {}
      # pull languages color
      workflow.color = (callback) =>
        #console.log "started processing color", new Date()
        names = Object.keys languages
        Language.find {name: {$in: names}}, (err, languages)=>
          return callback err if err?
          result = {}
          async.forEach languages, (language, async_callback)=>
            result[language.name] = language
            async_callback null
          , =>
            console.log "question color fetched", new Date()
            callback null, result
      
      # pull questions statistics
      ###
        Change question statistics
      ###
      ###
      workflow.questions = (callback) =>
        console.log "started processing question statistics", new Date()
        StackOverflow.questionsStatistics module_ids, (err, statistics)=>
          return callback err if err?

          result = {}
          async.forEach statistics, (module, async_callback)=>
            result[module._id] = module
            async_callback null
          , =>
            console.log "question statistics fetched", new Date()
            callback null, result
      ###

      workflow.map = ['color', (callback, results)=>
         #console.log "started aggregating", new Date()
         {color, questions} = results
         async.map output, (module, async_callback)=>           

           module.color    = color[module._source.language]?.color || "cccccc" #gray for non-specified color
           module.asked    = module._source.so_questions_asked
           module.answered = module._source.so_questions_answered

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
    ###
      Multi-match query ---
    ###
    ###
    query =
      custom_filters_score:
        query:
          multi_match:
            query: @context.discover_search_query || ""
            use_dis_max: true
            fields: ["description", "module_name^2", "owner^2"]
        filters: [
          {filter:{numeric_range: {watchers: {from: 2500, to: 5000} }}, boost: 1.25 }
          {filter:{numeric_range: {watchers: {from: 5000, to: 7500} }}, boost: 1.5 }
          {filter:{numeric_range: {watchers: {from: 7500, to: 10000} }}, boost: 1.75 }
          {filter:{numeric_range: {watchers: {from: 10000} }}, boost: 2 }
        ]
    ###
    query =
      fuzzy_like_this:
        like_text: @context.discover_search_query || ""
        fields: ["description", "module_name", "owner"]
        min_similarity: 0.5
        prefix_length: 3
        ignore_tf: true


    ###
        filters: [
          {filter:{numeric_range: {watchers: {from: 2500, to: 5000} }}, boost: 1.25 }
          {filter:{numeric_range: {watchers: {from: 5000, to: 7500} }}, boost: 1.5 }
          {filter:{numeric_range: {watchers: {from: 7500, to: 10000} }}, boost: 1.75 }
          {filter:{numeric_range: {watchers: {from: 10000, to: 20000} }}, boost: 2 }
          {filter:{numeric_range: {watchers: {from: 20000} }}, boost: 2.25 }
        ]
    ###

    options =
      size: 25
    
    #TODO: add variable size and offset han#dling

    console.log "request started", new Date()

    savedData = []
    esClient.search('mongomodules', 'module', {query}, options)
    .on('data', (data) =>
        console.log "received data", new Date()
        savedData.push data
    )
    .on('done', =>
        console.log "search completed", new Date()
        @_searchOutput savedData
    )
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
