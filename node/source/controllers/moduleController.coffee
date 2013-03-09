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
    if requiredData is 'stackoverflow' and format is 'json'
      #TODO: pull questions from SO database
      response = []
      process.nextTick =>
        for answer in [250..1000] by Math.ceil(Math.random()*100)        
          response.push {amount : answer, _id: answer, key: "total"}
          response.push {amount : answer*0.4, _id: answer+"_answered", key: "answered"}
        
        dateLength = response.length 
        stopDate  = new Date()
        startDate = new Date stopDate.getFullYear()-1, stopDate.getMonth(), stopDate.getDate()
         
        stopTS = stopDate.getTime()
        startTS = startDate.getTime()
        
        interval = ( stopTS - startTS ) / dateLength
        
        process.nextTick =>
          for i in [0...dateLength]
            deviation = if i > 4 and i < dateLength - 4 then Math.random()*interval else 0
            response[i].timestamp = Math.ceil(startTS + Math.floor(i/2)*interval + deviation)
          
          @res.json response  
      
    else
      Repo.get_module @moduleName, (err, module)=>
        if !err and module
          if @req.xhr
            @res.json module
          else
            @context.prepopulate = JSON.stringify module
            @context.module = module
            @context.body   = @_view 'module/view', @context
            @res.render 'base', @context
        else
          @res.send "Not found", 404

module.exports = (req,res)->
  new ModuleController req, res
