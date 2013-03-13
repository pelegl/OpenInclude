{get_models} = require '../conf'

[User] = get_models ["User"]

class AdminController extends require('./basicController')
  
  index: ->    
    @context.title = 'Admin'
    @context.body = @_view 'admin/admin', @context 
    @res.render 'base', @context

  users_with_stripe: ->
    console.log '[users_with_stripe] action'
    console.log @req.user._id
    if @req.method is "GET"
      if @req.user.group_id is 'admin'
        User.get_clientswithpayment (err,users) =>
          console.log err
          console.log users
          unless err
            Userarray =
              'users':users
            @context.title = 'Users with Stripe'
            @context.informationBox = @_view 'admin/users_with_stripe', Userarray
            @index()
          else
           @res.send "no users"
      else
       @res.redirect @context.profile_url 


module.exports = (req,res)->
  new AdminController req, res