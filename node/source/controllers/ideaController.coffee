nodemailer = require 'nodemailer'

class IdeaController extends require('./basicController')

  index: ->
    #console.log @req.body.email, @req.body.email
    transport = nodemailer.createTransport 'sendmail',
      path: '/usr/sbin/sendmail'
      args: ['-f', @req.body.email, 'start@openinclude.com']

    mailOptions =
      from: @req.user?.github_email || @req.body.email
      to: 'start@openinclude.com'
      subject: "OpenInclude - Share your ideas. From: #{@req.user?.github_username || @req.body.email }"
      text: @req.body.ideas

    transport.sendMail(mailOptions)

    @res.send status: 'success'
 
module.exports = (req,res)->
  new IdeaController req, res
