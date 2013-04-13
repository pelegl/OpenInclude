{get_models} = require '../conf'

[BlogPost] = get_models ["BlogPost"]

basic = require "./basicController"

class BlogController extends basic
  index: ->
    BlogPost.find({publish: true}).sort("-date").exec((result, posts) =>
      unless result
        @context.title = "Blog"
        @context.posts = posts
        @context.moment = require "moment"
        @context.body = @_view "blog/index", @context
        @res.render 'base', @context
      else
        @context.title = "Error"
        @context.body = "Error: #{result}"
        @res.render 'base', @context
    )

module.exports = (req,res)->
  new BlogController req, res

module.exports.create = (req, res) ->
  post = new BlogPost(req.body)
  post.save((result, post) ->
    unless result
      res.json {success: true, post: post}
    else
      res.json {success: false, error: result}
  )

module.exports.list = (req, res) ->
  BlogPost.find().sort("-date").exec(result, posts) ->
    unless result
      res.json posts
    else
      res.json {success: false, error: result}
  )