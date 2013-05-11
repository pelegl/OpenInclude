class models.Session extends models.User
  ###
   @param {String}   github_id
   @param {Boolean}  has_stripe
   @param {Array}    payment_methods
   @param {Boolean}  merchant
   @param {Boolean}  employee
   @param {String}   github_display_name
   @param {String}   github_email
   @param {String}   github_username
   @param {String}   github_avatar_url
   @param {String}   trello_id
   @param {ObjectId} _id
   @param {Boolean}  is_authenticated
  ###

  url: "/session"

  initialize: ->
    @load()

  isSuperUser: ->
    return @get("group_id") is 'admin'

  parse: (response, options) ->
    if response.is_authenticated
      ###
       set cookie for consiquent sign in attempts
      ###

      {github_display_name, github_avatar_url} = response
      @user = {github_display_name, github_avatar_url}

      $.cookie "returning_customer", {@user}, { expires: 30 }


    return response

  unload: ->
    delete @user
    $.removeCookie "returning_customer"

  load: ->
    cookie = $.cookie "returning_customer"
    {@user} = cookie if cookie?
    @fetch()