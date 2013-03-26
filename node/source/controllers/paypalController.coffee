{get_models,PAYPAL_CONF} = require '../conf'
[Stripe,User,Bill] = get_models ["Stripe","User","Bill"]
http = require 'https'

class PaypalController extends require('./basicController')
  constructor: (@req, @res)->
    @context =
      title : "Paypal" 
    super
      
  cancel: ->
    @res.redirect "/"

  returnurl: ->
    host = "https://api-3t.sandbox.paypal.com/nvp"
    token = @req.query['token']
    message =  "USER=#{PAYPAL_CONF.user}&PWD=#{PAYPAL_CONF.password}&SIGNATURE=#{PAYPAL_CONF.signature}&METHOD=GetAuthDetails&VERSION=88&token=#{token}"
    console.log message
    options = 
      hostname : 'api-3t.sandbox.paypal.com',
      path :'/nvp',
      method : 'POST'
      headers:
        'Content-Length': message.length

    req = https.request options, (res) =>
      console.log "statusCode: ", res.statusCode	
      console.log "headers: ", res.headers	
      data = "";
      res.on 'data', (d) ->
        data += d 
      res.on 'end',(d) =>
        console.log "data: ", data
        data = @parseString(data)      
        if data.ACK is 'Success'
          #Add paypal details to user account
          paymentObj =
            service: "PayPal"
            id:data.PAYERID
            paypal_email:data.EMAIL
          @req.user.payment_methods.push paymentObj
          @req.user.save (err)=>
            unless err
              @res.json data
        else
        	@res.json
        	  error:'Paypal error'   
        
    req.write(message)
    req.end()
    req.on "error", (err) ->
      console.error err
      
  cancel: ->
    @res.redirect "/"
  
  testPayment:->
    message ="requestEnvelope.errorLanguage=en_US&actionType=PAY&senderEmail=mahasoq_business@toobler.com&receiverList.receiver(0).email=mahasooq-buyer@toobler.com&receiverList.receiver(0).amount=100.00&currencyCode=USD&feesPayer=EACHRECEIVER&memo=Simple payment example.&cancelUrl=http://ec2-54-225-224-68.compute-1.amazonaws.com:9100/payment/cancel&returnUrl=http://ec2-54-225-224-68.compute-1.amazonaws.com:9100/payment/returnurl&ipnNotificationUrl=http://ec2-54-225-224-68.compute-1.amazonaws.com:9100/payment/ipn"
    options =
      hostname: 'svcs.sandbox.paypal.com',
      path: '/AdaptivePayments/Pay',
      method: 'GET',
      headers:
        'Content-Length': message.length
        'X-PAYPAL-SECURITY-USERID': 'mahasoq_business_api1.toobler.com'
        'X-PAYPAL-SECURITY-PASSWORD': '1363755650'
        'X-PAYPAL-SECURITY-SIGNATURE': 'ATkmd0rgKGMGKsBTlxitQ84qivhFAyKUmMoFHdzWJTBEcWJIHI5EBhnF'
        'X-PAYPAL-REQUEST-DATA-FORMAT': 'NV'
        'X-PAYPAL-RESPONSE-DATA-FORMAT': 'JSON'
        'X-PAYPAL-APPLICATION-ID': 'APP-80W284485P519543T'

    req = https.request options, (res) ->
      console.log "statusCode: ", res.statusCode	
      console.log "headers: ", res.headers	
      data = "";
      res.on 'data', (d) ->
        data += d
      res.on 'end',(d) ->
        console.log "data: ", data
        data = JSON.stringify data
        console.log "data: ", data
  #		callback(null, data)
    req.write(message)
    req.end()
    req.on "error", (err) ->
      console.error err
    
  paypalAuthenticate: ->
    console.log PAYPAL_CONF
    console.log PAYPAL_CONF.user
    message = "USER=#{PAYPAL_CONF.user}&PWD=#{PAYPAL_CONF.password}&SIGNATURE=#{PAYPAL_CONF.signature}&VERSION=88&CANCELURL=#{PAYPAL_CONF.cancelurl}&RETURNURL=#{PAYPAL_CONF.returnurl}&LOGOUTURL=#{PAYPAL_CONF.logouturl}&METHOD=SetAuthFlowParam&SERVICEDEFREQ1=Required&SERVICENAME2=Email&SERVICEDEFREQ2=Required"
    console.log message
    options = 
      hostname : 'api-3t.sandbox.paypal.com',
      path :'/nvp',
      method : 'POST'
      headers:
        'Content-Length': message.length

    req = https.request options, (res) =>
      console.log "statusCode: ", res.statusCode	
      console.log "headers: ", res.headers	
      data = "";
      res.on 'data', (d) ->
        data += d 
      res.on 'end',(d) =>
        console.log "data: ", data                
        data = @parseString(data)
        if data.ACK is 'Success'
          red_url = "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_account-authenticate-login&token=#{data.TOKEN}"
          console.log red_url 	
          @res.redirect(red_url)
        else
        	@res.json
        	  error:'Paypal error'        	  

    req.write(message)
    req.end()
    req.on "error", (err) ->
      console.error err

  parseString:(str) ->
#    msg = "TOKEN=HA%2d5S5ZYG7SNXN3L&TIMESTAMP=2013%2d03%2d25T12%3a18%3a07Z&CORRELATIONID=d9086c0b5ecef&ACK=Success&VERSION=88&BUILD=5479129"
    keyValuePairs = str.split("&")
    json = {}
    i = 0
    while i < keyValuePairs.length
      tmp = keyValuePairs[i].split("=")
      key = decodeURIComponent(tmp[0])
      value = decodeURIComponent(tmp[1])
#      key = tmp[0]
#      value = tmp[1]

      unless key.search(/\[\]$/) is -1
        tmp = key.replace(/\[\]$/, "")
        json[tmp] = json[tmp] or []
        json[tmp].push value
      else
        json[key] = value
      i++
    json
    

module.exports = (req,res)->
  new PaypalController req, res