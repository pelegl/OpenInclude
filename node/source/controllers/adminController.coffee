{get_models} = require '../conf'

[User,Bill] = get_models ["User","Bill"]

class AdminController extends require('./basicController')
  
  index: ->    
    @context.body = @_view 'admin/admin', @context 
    @res.render 'base', @context

  issue_bill: ->
    console.log '[issue_bill] action'
    if @req.method is "GET" and @req.user?.is_superuser()
        [username] = @get
        return @res.send "Incorrect action" unless username

        User.getUserByName username, (err, user) =>
          return @res.send "Error occured", 500 if err?
          return @res.send "User doesnt have stripe account", 404 unless user.has_stripe

          @context.user  = user
          @context.title = 'Admin - Issue Bill'

          Bill.get_bills user._id, (err, bills)=>
            return @res.send "Error occured", 500 if err?
            @context.bills = bills
            @context.informationBox = @_view 'admin/bill', @context
            @index()

    else
      @res.send "Not Permitted",401
      	
  users_with_stripe: ->
    console.log '[users_with_stripe] action'
    if @req.method is "GET" and @req.user?.is_superuser()

        User.getClientsWithStripe (err, users) =>
          return @res.json {success: false, err} if err

          unless err
            @context.title = 'Users with Stripe'
            @context.informationBox = @_view 'admin/users_with_stripe', {users}
            @index()
          else
           @res.send "no users"
    else
      @res.send "Unauthorized", 403


module.exports = (req,res)->
  new AdminController req, res
