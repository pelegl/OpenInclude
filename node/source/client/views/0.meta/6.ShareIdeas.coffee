views.ShareIdeas = Backbone.View.extend
  events:
    'click .share-ideas': 'toggleShow'
    'click .close': 'toggleShow'
    'click .submit': 'submit'

  initialize: ->
    console.log '[__ShareIdeasView__] Init'

  toggleShow: ->
    $('.share-common').toggleClass('show')

  submit: ->
    $email = $ '#email'
    $ideas = $ '#ideas'
    $self = $ '.submit'

    $self.addClass 'disabled'
    $self.html "<img src=\"#{app.conf.STATIC_URL}images/loader.gif\" alt=\"Loading...\" class=\"loader\" />"

    $.post('/share-idea',
      {email: $email.val(), ideas: $ideas.val()},
    (data) ->
      if (data.status == 'success')
        $self.html('Success')
      else
        $self.html('Error occured')

      setTimeout(() ->
        $('.share-common').toggleClass('show')
        setTimeout(() ->
          $self.removeClass('disabled').html('Submit')
          $email.val('')
          $ideas.val('')
        , 500)
      , 1000)

    )