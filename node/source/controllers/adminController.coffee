{get_models} = require '../conf'

[User,Bill] = get_models ["User","Bill"]

class AdminController extends require('./basicController')
  
  index: ->    
    @context.body = @_view 'admin/admin', @context 
    @res.render 'base', @context

  issue_bill: ->
    console.log '[issue_bill] action'
    if @req.method is "GET" and @req.user?.is_superuser()
        [userid] = @get
        return @res.send "Incorrect action" unless userid

        User.get_user userid,(error, user) =>
          if ! error and user.has_stripe
            @context.user = user
            @context.title = 'Admin - Issue Bill'
            @context.informationBox = @_view 'admin/bill', @context
            @index()
    else
      @res.send "Not Permitted",401
  
  create_bills: ->
    console.log '[create_bill] action'
    if @req.method is "POST" and @req.user?.is_superuser()

      {amount, description, userid} = @req.body.bill

      billObj =
        bill_amount: amount
        bill_to_whome: userid
        bill_description: description

      Bill.create billObj, (err, result)=>
        # TODO: fix return results
        res.json
          success: if !err then true else false
          result: result

    else
      @res.send 'Not Permitted',401
      	
  users_with_stripe: ->
    console.log '[users_with_stripe] action'
    if @req.method is "GET" and @req.user?.is_superuser()

        User.get_clientswithpayment (err, users) =>
          return @res.json {success: false, err} if err

          unless err
            Userarray =
              users: users
            @context.title = 'Users with Stripe'
            @context.informationBox = @_view 'admin/users_with_stripe', Userarray
            @index()
          else
           @res.send "no users"
    else
      @res.send "Unauthorized", 403


module.exports = (req,res)->
  new AdminController req, res
