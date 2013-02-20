{esClient} = require '../conf'

class DiscoverController extends require('./basicController') 
  constructor: ->
    @context =
      discover_search_action : "/discover/search"
    super
  
  index: ->
    @context.body = @_view 'discover/index', @context    
    @res.render 'base', @context

  search: ->
    {q} = @req.query
    @context.discover_search_query = q
            
    query =       
      query:
        multi_match:
          query: q
          use_dis_max: true
          fields: ["description", "module_name^2", "language^1.5"]
    
    options =
      size: 50
    
    #TODO: add variable size and offset handling
            
    savedData = []
    esClient.search('mongomodules', 'module', query, options)
    .on('data', (data)=>
      savedData.push data
    )
    .on('done', ()=>
      data = JSON.parse(savedData.join "")           
      if data.hits
        maxScore = data.hits.max_score  
        output = data.hits.hits
      else
        output = []
                   
      if @req.xhr      
        @res.json {searchData: output, maxScore}
      else
        @context.searchData = JSON.stringify output
        @context.maxScore   = maxScore
        @index() 
    )
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
