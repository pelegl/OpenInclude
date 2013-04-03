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
        
    async.forEach output, (repository, callback) =>
      {language, _id} = repository._source
      languages[language] = language
      module_ids.push toObjectId(_id)
      callback null
    , =>      
      workflow = {}
      # pull languages color
      workflow.color = (callback) =>
        names = Object.keys languages
        Language.find {name: {$in: names}}, (err, languages)=>
          return callback err if err?
          result = {}
          async.forEach languages, (language, async_callback)=>
            result[language.name] = language
            async_callback null
          , => callback null, result
      
      # pull questions statistics
      ###
        Change question statistics
      ###

      workflow.questions = (callback) =>
        StackOverflow.questionsStatistics module_ids, (err, statistics)=>
          return callback err if err?

          result = {}
          async.forEach statistics, (module, async_callback)=>
            result[module._id] = module
            async_callback null
          , => callback null, result

      workflow.map = ['color', 'questions', (callback, results)=>
         {color, questions} = results
         async.map output, (module, async_callback)=>           
           module.color    = color[module._source.language]?.color || "cccccc" #gray for non-specified color
           if (q = questions[module._source._id])?
             module.asked    = q.asked
             module.answered = q.answered
           else
             module.asked    = 0
             module.answered = 0                       
           async_callback null, module
         , callback            
      ]
      
      async.auto workflow, (err, data)=>
        throw err if err?
        
        output = data.map
      
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
      custom_filters_score:
        query:
          flt:
            like_text: @context.discover_search_query || ""
            fields: ["description", "module_name", "owner"]
            min_similarity: 0.5
            prefix_length: 2
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
    
    #TODO: add variable size and offset handling

    #console.log query

    savedData = []
    esClient.search('mongomodules', 'module', {query}, options)
    .on('data', (data) => savedData.push data)
    .on('done', => @_searchOutput savedData)
    .on('error', (error)=>
      if @req.xhr      
        @res.json error, 500
      else
        @context.searchError = true
        @index()
    )
    .exec()

module.exports = (req,res)->
  new DiscoverController req, res
