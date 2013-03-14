{get_models} = require '../conf'

[User,Bill] = get_models ["User","Bill"]

class AdminController extends require('./basicController')
  
  index: ->    
    @context.body = @_view 'admin/admin', @context 
    @res.render 'base', @context

  issue_bill: ->
    console.log '[issue_bill] action'
    if @req.user.group_id is 'admin'
      if @req.method is "GET"
        params = @req.params[0]
        params = params.split '/'
        if params[2] isnt undefined and params[2] isnt ''
          userid = params[2]
          console.log userid
          User.get_user userid,(error,user) =>
            if not error and user.has_stripe
              console.log user.github_username
              @context.user = user
              @context.title = 'Admin - Issue Bill'
              @context.informationBox = @_view 'admin/bill', @context
              @index()
            else
              @res.redirect @context.admin_url
         else
           @res.redirect @context.admin_url
      else
        @res.redirect @context.admin_url
    else
      @res.send "Not Permitted"
  
  create_bills: ->
    console.log '[create_bill] action'
    if @req.user.group_id is 'admin'
      if @req.method is "POST"
        {amount, description, userid} = @req.body.bill
        billObj =
          bill_amount: amount
          bill_to_whome: userid
          bill_description: description
        console.log billObj
        Bill.create billObj, (err, result)=>
          unless err 
          	@res.redirect @context.users_with_stripe
          else
          	@res.send 'Error',400
      else
        @res.redirect @context.admin_url
    else
      @res.send 'Not Permitted',401
      	
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
       @res.redirect @context.admin_url 


module.exports = (req,res)->
  new AdminController req, res
