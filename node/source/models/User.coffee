schema =
  github_id: Number
  github_display_name: String
  github_username: String
  github_avatar_url: String

methods =
  public_info: ->
    return {@github_id, @github_display_name, @github_username, @github_avatar_url, is_authenticated: true}
    
  hello: () ->
    return "Hello, #{@github_username}!"

exports.schema = schema
exports.methods = methods
