conf               = require '../conf'
async              = require 'async'
fs                 = require 'fs'

[User] = conf.get_models ["User"]


generate_list = (callback)->

  output = "<table class='table'>"
  output += "<thead><tr><th>Github username</th><th>Github email</th><th>Paypal e-mail</th><th>Reader?</th></tr></thead>"
  User.find {}, "github_username github_email payment_methods paypal", (err, users)->
    return callback err if err?
    async.map users, (user, async_callback)->

      paypal = user.paypal || "not signed up"
      stripe = user.get_payment_method("Stripe")
      stripe = if stripe? then "signed up" else "not signed up"

      async_callback null, "<tr><td>#{user.github_username}</td><td>#{user.github_email || 'no email'}</td><td>#{paypal}</td><td>#{stripe}</td></tr>"
    ,(err, data)->
      output += data.join("") + "</table>"
      callback null, output

if require.main is module
  generate_list (err, output)->
    console.error err if err?
    fs.writeFileSync("#{__dirname}/userdata/userlist.#{new Date().getTime()}.html", output, "utf-8")
    process.exit(0)

module.exports = generate_list
