_            = require 'underscore'
hb           = require 'handlebars'

{STATIC_URL, logout_url, update_credit_card, signin_url, profile_url, github_auth_url, discover_url, how_to_url, modules_url, merchant_agreement, developer_agreement,view_bills,users_with_stripe} = require '../conf'

class BasicController
  constructor: (@req,@res)->    
    path = @req.path
    segments = _.without path.split("/"), ""
    offset = @offset || 0
    
    #@controllerName = segments[0] - not using it, omitting
    @funcName       = if segments[(1-offset)]? and ! /^_/.test(segments[(1-offset)]) then segments[(1-offset)] else 'index' # functions starting with _ - are internal functions
    @get            = segments[(2-offset)..] if segments.length > (2-offset)
    
    if typeof @[@funcName] is 'function'
      @app = @req.app
      context = {
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
        modules_url,
        merchant_agreement, 
        developer_agreement,
        update_credit_card,
        view_bills,
        users_with_stripe    
      } 
        
      if @context then _.extend @context, context else @context = context #extend our context - maybe we had already set it up in the child contstructor
      
      @[@funcName]()
    else
      @res.send "Error 404", 404
   #   console.log "404 error"
      
  _view : (name, context)=>
    return hb.compile(@app.Views[name])(context)

module.exports = BasicController
