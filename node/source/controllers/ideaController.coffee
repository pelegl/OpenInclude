nodemailer = require 'nodemailer'

class IdeaController extends require('./basicController')

  index: ->
    #console.log @req.body.email, @req.body.email
    transport = nodemailer.createTransport 'sendmail',
      path: '/usr/sbin/sendmail'
      args: ['-f', @req.body.email, 'start@openinclude.com']

    if @req.user?.github_email?
      from = @req.user.github_email
    else if @req.body.email?
      from = @req.body.email
    else
      from = "nobody@openinclude.com"

    mailOptions =
      from: 'nobody@openinclude.com'
      "reply-to": from
      to: 'start@openinclude.com'
      subject: "OpenInclude - Share your ideas. From: #{from}"
      text: @req.body.ideas

    transport.sendMail(mailOptions)

    @res.send status: 'success'
 
module.exports = (req,res)->
  new IdeaController req, res
