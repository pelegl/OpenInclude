class ProfileController extends require('./basicController') 
  constructor: (@req, @res)->
    # переписанный конструктор - добавляем переменные в контекст у всех методов
    @context =
      member: @req.user
      
    {q} = @req.query
    # if q then @context.discover_search_query = q
    # вызываем родительский конструктор
    super
  
  index: ->
    # console.log(@context.member)
    @context.title = 'User Profile'
    @context.body = @_view 'member/profile', @context  #рендерим {{{body}}} в контекст
    @res.render 'base', @context # рендерим layout/base.hbs с контекстом @context
 
# Здесь отдаем функцию - каждый раз когда вызывается наш контроллер - создается новый экземпляр - это мы вставим в рутер
module.exports = (req,res)->
  new ProfileController req, res
