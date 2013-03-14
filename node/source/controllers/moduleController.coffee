###
  Loading config
###
_            = require 'underscore'
{get_models, STATIC_URL, logout_url, signin_url, profile_url, github_auth_url, discover_url, how_to_url, modules_url} = require '../conf'


###
  Getting module
###
[Languages, Repo] = get_models ["Language","Module"]


class ModuleController extends require('./basicController') 
  constructor: (@req,@res)->    
    path = @req.path
    segments = _.without path.split("/"), ""
    
    
    @language       = segments[1] if segments[1]? 
    @moduleName     = segments[2] if segments[2]?
    @get            = segments[3..] if segments.length > 3
        
    @app = @req.app
    @context = {
      title: "Home Page"
      STATIC_URL,
      in_stealth_mode: false,
      user: @req.user,
      logout_url,
      signin_url,
      profile_url,
      github_auth_url,
      discover_url,
      how_to_url,
      modules_url
    } 
        
    
    unless @language
      @index()
    else if @moduleName
      @context.language = @language.capitalize()
      @module()
    else if @language
      @context.language = @language.capitalize()
      @module_list()
    else
      res.send "error", 404
  
  ###
    Index - returns set of languages
  ###
  index: ->
    {page, limit} = @req.query    
    pageNumber = if page then parseInt(page) else 0
    limit = if limit then parseInt(limit) else 30
    
    Languages.get_page pageNumber, limit, (err, output)=>    
      unless err
        if @req.xhr
          @res.json output
        else
          totalPages = Math.ceil(output.total_count/limit)          
          if totalPages > 0
            @context.pages = []
            for i in [1..totalPages]
              @context.pages.push {text: i, isActive: pageNumber-1 is i}
          
            @context.prev = (pageNumber - 1).toString() if pageNumber > 0             
            @context.next = pageNumber + 1 if totalPages-1 > pageNumber
           
          @context.prepopulation  = JSON.stringify output
          @context.languages      = output.languages
          @context.body           = @_view 'module/index', @context    
          
          @res.render 'base', @context
      else
        console.error err
        res.send "Error", 500
        
  module_list: ->
    {page, lmit} = @req.query
    pageNumber = if page  then parseInt(page)  else 0
    limit      = if limit then parseInt(limit) else 30
    
    Languages.get_siblings @language, pageNumber, limit, (err, output)=>
      unless err
        if @req.xhr
          @res.json output
        else        
          totalPages = Math.ceil(output.total_count/limit)
          if totalPages > 0
            @context.pages = []
            for i in [1..totalPages]
              @context.pages.push {text:i, isActive: pageNumber-1 is 1}
            @context.prev = (pageNumber - 1).toString() if pageNumber > 0
            @context.next = pageNumber + 1 if totalPages-1 > pageNumber
          
          @context.prepopulation  = JSON.stringify output
          @context.modules        = output.modules
          @context.body           = @_view 'module/modules', @context
          
          @res.render 'base', @context
      else
        console.error err
        res.send "Error", 500
    
  module: ->
    [requiredData, format] = @get if @get?
    
    # get module
    Repo.get_module @moduleName, (err, module)=>
      # error handling
      if err or !module
        console.error err if err?
        return @res.json {err, success: false}, 404 if @req.xhr
        return @res.send "Not found", 404
      ####
      # so questions      
      if requiredData is 'stackoverflow' and format is 'json'
        # get questions        
        module.get_questions (err, resp)=>
          return @res.json {err, success: false} if err?          
          @res.json resp
      # github events
      else if requiredData is 'github_events' and format is 'json'
        # get events
        module.get_events (err, events)=>
          return @res.json {err, success: false} if err?
          @res.json events        
      # module data
      else
        # xhr                  
        return @res.json module if @req.xhr
        # direct access                  
        @context.prepopulate = JSON.stringify module
        @context.module = module
        @context.body   = @_view 'module/view', @context
        @res.render 'base', @context


module.exports = (req,res)->
  new ModuleController req, res
