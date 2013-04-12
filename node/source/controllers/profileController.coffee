_ = require 'underscore'
agreement_text = require("../util").strings.agreement
basic = require './basicController'
get_models = require('../conf').get_models

_ = require "underscore"

[User, Stripe, Bill] = get_models ["User", "Stripe", "Bill"]

class ProfileController extends basic

  index: ->
    @context.title = 'User Profile'
    @context.private = true
    @context.body = @_view 'member/profile', @context
    #рендерим {{{body}}} в контекст

    @res.render 'base', @context # рендерим layout/base.hbs с контекстом @context

  login: ->
    @context.title = "Authentication"
    @context.body = @_view 'registration/login', @context
    @res.render 'base', @context


  _generateAgreementField: (text, action)->
    agreement =
      agreement_signup_action: action
      agreement_text: text
    @context.informationBox = @_view 'member/agreement', agreement
    @index()

  _acceptToa: (accountType) ->
    {signed} = @req.body
    if signed is 'signed'
      switch accountType
        when 'merchant'
          @req.user.merchant = true
          @req.user.groups.push "reader"
        when 'developer'
          @req.user.employee = true
          @req.user.groups.push "writer"

      @req.user.save (err)=>
        unless err
          unless @req.xhr then @res.redirect "back" else @res.json {success: true, user: @req.user.public_info() }
        else
          unless @req.xhr then @res.redirect "back" else @res.json {success: false, err: "Error updating database"}

    else
      unless @req.xhr then @res.redirect "back" else @res.json {success: false, err: "Please, sign the agreement"}



  merchant_agreement: ->
    if @req.method is "GET"
      unless @req.user.merchant is true
        @_generateAgreementField agreement_text, @context.merchant_agreement
      else
        @res.redirect @context.profile_url
    else
      @_acceptToa "merchant"

  developer_agreement: ->
    if @req.method is "GET"
      unless @req.user.employee is true
        @_generateAgreementField agreement_text, @context.developer_agreement
      else
        @res.redirect @context.profile_url
    else
      @_acceptToa "developer"

  update_credit_card: ->
    if @req.method in ["POST", "GET"]
      {givenName, lastName, number, expiration, cvv} = @req.body.card
      [exp_month, exp_year] = expiration.split "/"

      req = @req

      Stripe.addCustomer @req.user, "Stripe payment method for #{givenName} #{lastName}", number, exp_month, exp_year, cvv, "#{givenName} #{lastName}", (err, result)=>
        unless err
          req.user.merchant = true
          req.user.groups.push "reader"
          req.user.save()
        @res.json {
        success: if err? then false else true
        err
        result
        }

    else
      @res.send "Not permitted", 401

  update_paypal: ->
    if @req.body.paypal
      @req.user.employee = true
      @req.user.groups.push "writer"
      @req.user.paypal = @req.body.paypal
      @req.user.save((result, user) =>
        unless result
          @res.json {success: true}
        else
          @res.json {success: false, error: result}
      )

  view: ->
    User.findOne {github_username: @get[0]}, (result, data) =>
      if result or data is null
        @res.status(404)
        @context.title = "User not found"
        @context.body = "Sorry, user #{@get[0]} not found"
        @res.render "base", @context
      else
        @context.title = "Profile of #{@get[0]}"
        @context.user = data.toJSON()
        @context.private = false
        @context.body = @_view "member/profile", @context
        @res.render "base", @context

  bills: ->
    if @req.method is "GET" and @req.user

      if @get?.length is 1
        [id] = @get
        Bill.findOne {_id: id, user: @req.user._id}, (err, bill) =>
          # err
          return @res.send 'Not Found', 404 if err
          # xhr
          return @res.json bill if @req.xhr

          @context.bill = bill
          @context.informationBox = @_view 'member/bill', @context
          @index()

      else if @get?.length is 2 and @req.user.is_superuser()
        github_username = @get[1]
        User.getUserByName github_username, (err, user) =>
          return @res.json {success: false, err}, 400 if err?
          Bill.get_bills user._id, (err, bills) =>
            return @res.json {success: false, err}, 400 if err?
            @res.json bills

      else
        Bill.get_bills @req.user._id, (err, bills) =>
          # err
          return @res.send 'Not Found', 404 if err
          # xhr
          return @res.json bills if @req.xhr

          @context.title = 'Bills'
          @context.informationBox = @_view 'member/bills', bills
          @index()

    else if @req.method is "POST" and @req.user?.is_superuser()
      # POST verb - create a bill
      {bill} = @req.body
      bill.amount = bill.amount.replace(/\$/, "") if bill.amount?

      Bill.create bill, (err, result)=>
        # direct access - no js
        unless @req.xhr
          console.error err if err?
          return @res.redirect "back"
        # xhr
        return @res.json {success: false, err}, 400 if err?
        @res.json
          success: true
          bill: result

    else
      @res.send 'Not Permitted', 403

  bills2: ->
    req = @req
    res = @res
    Bill.find().populate("from_user to_user").exec((result, bills) ->
      bills = _.reduce(bills, (result, item) ->
        if item.from_user._id = req.user._id
          result.push(item)
        result
      , [])

      res.json bills
    )

# Здесь отдаем функцию - каждый раз когда вызывается наш контроллер - создается новый экземпляр - это мы вставим в рутер
module.exports = (req, res)->
  new ProfileController req, res