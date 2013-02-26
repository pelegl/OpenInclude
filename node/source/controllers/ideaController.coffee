nodemailer = require 'nodemailer'

class IdeaController extends require('./basicController')

  index: ->
    # console.log(@req.body.email, @req.body.ideas)
    transport = nodemailer.createTransport 'sendmail',
      path: 'usr/sbin/sendmail'
      # args: ['-f', @req.body.email, 'contact@openinclude.com']
      args: ['-f', @req.body.email, 'pho.nzp@gmail.com']

    mailOptions =
      from: @req.body.email
      # to: 'contact@openinclude.com'
      to: 'pho.nzp@gmail.com'
      subject: 'OpenInclude - Share your ideas'
      text: @req.body.ideas

    transport.sendMail(mailOptions)

    @res.redirect('/')
 
module.exports = (req,res)->
  new IdeaController req, res
