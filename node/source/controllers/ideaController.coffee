nodemailer = require 'nodemailer'

class IdeaController extends require('./basicController')

  index: ->
    transport = nodemailer.createTransport 'sendmail',
      path: '/usr/sbin/sendmail'
      args: ['-f', @req.body.email, 'wdvorak@openinclude.com']

    mailOptions =
      from: @req.body.email
      to: 'wdvorak@openinclude.com'
      subject: 'OpenInclude - Share your ideas'
      text: @req.body.ideas

    transport.sendMail(mailOptions)

    @res.redirect('/')
 
module.exports = (req,res)->
  new IdeaController req, res
