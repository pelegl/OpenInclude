_            = require 'underscore'
agreement_text = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. "
{get_models} = require '../conf'

[Stripe,Bill] = get_models ["Stripe","Bill"]

class ProfileController extends require('./basicController')   
  
  index: ->    
    @context.title = 'User Profile'
    @context.body = @_view 'member/profile', @context  #рендерим {{{body}}} в контекст
    @res.render 'base', @context # рендерим layout/base.hbs с контекстом @context
 
  login: ->    
    @context.title = "Authentication"    
    @context.body = @_view 'registration/login', @context
    @res.render 'base', @context
    

  _generateAgreementField: (text, action)->
    agreement =
      agreement_signup_action : action
      agreement_text          : text
    @context.informationBox = @_view 'member/agreement', agreement
    @index()
  
  _acceptToa: (accountType) ->
    {signed} = @req.body
    if signed is 'signed'
      switch accountType
        when 'merchant'          
          @req.user.merchant = true
        when 'developer'
          @req.user.employee = true
      
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
            
      Stripe.addCustomer @req.user, "Stripe payment method for #{givenName} #{lastName}", number, exp_month, exp_year, cvv, "#{givenName} #{lastName}", (err, result)=>
        @res.json {
          success: if err? then false else true 
          err
          result
        }
         
    else
      @res.send "Not permitted", 401
      
  view_bills:(param) ->
    console.log '[view_bills] action'
    console.log @req.params
    if @req.method is "GET"
      unless @req.user.employee is true
        Bill.get_bills @req.user._id,(err,bills) =>
          unless err
            billarray =
              'bills':bills
            @context.title = 'Bills'
            @context.informationBox = @_view 'member/bills', billarray
            @index()
          else
           @res.send "no bills"
      else
       @res.redirect @context.profile_url 
    	
	  	 
 
# Здесь отдаем функцию - каждый раз когда вызывается наш контроллер - создается новый экземпляр - это мы вставим в рутер
module.exports = (req,res)->
  new ProfileController req, res

