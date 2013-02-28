class ProfileController extends require('./basicController') 

  index: ->    
    @context.title = 'User Profile'
    @context.body = @_view 'member/profile', @context  #рендерим {{{body}}} в контекст
    @res.render 'base', @context # рендерим layout/base.hbs с контекстом @context
 
  login: ->    
    @context.title = "Authentication"    
    @context.body = @_view 'registration/login', @context
    @res.render 'base', @context
        
 
# Здесь отдаем функцию - каждый раз когда вызывается наш контроллер - создается новый экземпляр - это мы вставим в рутер
module.exports = (req,res)->
  new ProfileController req, res
