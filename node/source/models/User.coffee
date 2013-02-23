schema =
  github_id: Number
  github_display_name: String
  github_username: String
  github_avatar_url: String

methods =
  hello: () ->
    return "Hello, #{@github_username}!"

exports.schema = schema
exports.methods = methods
