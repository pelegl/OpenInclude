// Generated by CoffeeScript 1.6.1
var STATIC_URL, get_models, github_auth, github_auth_url, is_authenticated, is_not_authenticated, logout, modules_url, signin_url, _ref;

_ref = require('./conf'), STATIC_URL = _ref.STATIC_URL, modules_url = _ref.modules_url, github_auth = _ref.github_auth, get_models = _ref.get_models, is_authenticated = _ref.is_authenticated, github_auth_url = _ref.github_auth_url, logout = _ref.logout, signin_url = _ref.signin_url, is_not_authenticated = _ref.is_not_authenticated;

exports.set = function(app) {
  /*
    git webhook
  */
  app.all('/git/webhook', function(req, res) {
    console.log(req.body);
    return res.send("ok");
  });
  /*
  Discover controller
  */

  app.get('/discover', app.Controllers.discover);
  app.get('/discover/*', app.Controllers.discover);
  /*
  Module controller
  */

  app.get(modules_url, app.Controllers.module);
  app.get("" + modules_url + "/*", app.Controllers.module);
  /*
  Share idea
  */

  app.post('/share-idea', app.Controllers.idea);
  /*
  Payment
  */

  app.get('/payment/*', app.Controllers.payment);
  /*
  Profile interaction
  */

  app.get(signin_url, is_not_authenticated, app.Controllers.profile);
  app.all('/profile/:action', is_authenticated, app.Controllers.profile);
  app.get('/profile*', is_authenticated, app.Controllers.profile);
  /*
  Session interaction
  */

  app.get('/session*', app.Controllers.session);
  /*
  oAuth interaction
  */

  app.get("/auth/logout", logout);
  app.get("" + github_auth_url, github_auth());
  app.get("" + github_auth_url + "/callback", github_auth({
    scope: 'user',
    failureRedirect: '/profile/login'
  }), function(request, response) {
    return response.redirect('/profile');
  });
  /*
  App
  */

  return app.get('/*', app.Controllers.index);
};
