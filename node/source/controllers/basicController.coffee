_   = require 'underscore'
hb  = require 'handlebars'
dot = require 'dot'

{STATIC_URL, urls, dotJsContext} = require '../conf'

class BasicController
  constructor: (@req, @res)->
    path = @req.path
    segments = _.without path.split("/"), ""
    segments = _.map segments, (item) -> decodeURIComponent(item)
    offset = @offset || 0
    
    #@controllerName = segments[0] - not using it, omitting
    @funcName       = if segments[(1-offset)]? and ! /^_/.test(segments[(1-offset)]) then segments[(1-offset)] else 'index' # functions starting with _ - are internal functions
    @get            = segments[(2-offset)..] if segments.length > (2-offset)
    
    if typeof @[@funcName] isnt 'function'
      if typeof @['index'] is 'function'
        @funcName = 'index'
      else
        @res.send "Error 404", 404
        return

    @app = @req.app

    config =
      title:        "Home Page"
      STATIC_URL:   STATIC_URL
      user:         @req.user

    context = _.extend {}, urls, config

    if @context then _.extend @context, context else @context = context #extend our context - maybe we had already set it up in the child contstructor
    @_buildMenu()

    @[@funcName]()

  _buildMenu: ->
    @context._menu = [
      {url: @context.discover_url, text: "discover"}
      {url: @context.how_to_url,   text:"how to"}
    ]
    # admin
    #if @req.user?.group_id is 'admin'
    #  @context._menu.push {url: @context.admin_url, text:"admin"}
    # rest
    if @req.user?
      @context._menu.push {url: @context.profile_url, text: "profile"},
                          #{url: @context.dashboard_url, text: "dashboard"},
                          {url: @context.logout_url, text: "sign out"}
    else
      @context._menu.push {url: @context.signin_url, text: "sign in"}

    @context._menu.push {url: @context.blog_url, text: "blog", attributes: ['nobackbone']}

    if @req.path.length > 1
      @context._menu.forEach (link)=>
        testUrl = new RegExp("^#{@_escapeRegExp(link.url)}.*$")
        link.isActive = true if testUrl.test @req.path

  _escapeRegExp: (str)->
    return str.replace /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"

  _view : (name, context)->
    if @app.Views['dot'].hasOwnProperty(name)
        try
          _.extend context, dotJsContext
          html = dot.compile(@app.Views['dot'][name], {partials: @app.Partials})(context, null, {partials: @app.Partials})
        catch e
          return e
    else
        html = hb.compile(@app.Views['hbs'][name])(context)

    html

module.exports = BasicController