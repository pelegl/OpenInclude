(function() {



}).call(this);

(function() {



}).call(this);

(function() {



}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var View, root, views;
    root = this;
    views = this.hbt;
    exports.MetaView = (function(_super) {

      __extends(MetaView, _super);

      function MetaView() {
        return MetaView.__super__.constructor.apply(this, arguments);
      }

      MetaView.prototype.events = {};

      MetaView.prototype.initialize = function() {
        return console.log('[__metaView__] Init');
      };

      return MetaView;

    })(this.Backbone.View);
    View = (function(_super) {

      __extends(View, _super);

      View.prototype.el = '<section class="contents">';

      View.prototype.viewsPlaceholder = '#view-wrapper';

      function View(opts) {
        if (opts == null) {
          opts = {};
        }
        if (opts.prevView == null) {
          opts.el = $('.contents').eq(0);
        } else {
          $(window).scrollTop(0);
        }
        View.__super__.constructor.call(this, opts);
      }

      return View;

    })(this.Backbone.View);
    return exports.Index = (function(_super) {

      __extends(Index, _super);

      function Index() {
        return Index.__super__.constructor.apply(this, arguments);
      }

      Index.prototype.initialize = function() {
        console.log('[__indexView__] Init');
        this.context = {
          title: "Home Page",
          STATIC_URL: app.conf.STATIC_URL,
          in_stealth_mode: true
        };
        if (this.options.prevView != null) {
          try {
            this.options.prevView.remove();
            this.options.prevView = null;
          } catch (_error) {}
          return $(this.viewsPlaceholder).html(this.render().el);
        } else {
          return this.render();
        }
      };

      Index.prototype.render = function() {
        var html;
        html = views['index'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'index');
        return this;
      };

      return Index;

    })(View);
  }).call(this, (window.views = {}));

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var App;
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        return App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.conf = {
        STATIC_URL: "/static/"
      };

      App.prototype.routes = {
        "": "index",
        "!/": "index",
        "discover*": "discover",
        "!/discover*": "discover"
      };

      App.prototype.init = function() {
        var hash;
        if (!Backbone.history._hasPushState) {
          hash = Backbone.history.getHash();
          this.navigate('', {
            trigger: false
          });
          return this.navigate(hash, {
            trigger: true
          });
        }
      };

      App.prototype.reRoute = function() {
        if (!Backbone.history._hasPushState && Backbone.history.getFragment().slice(0, 2) !== '!/') {
          this.navigate('!/' + Backbone.history.getFragment(), {
            trigger: true
          });
          return document.location.reload();
        }
      };

      App.prototype.go = function(fr, opts) {
        if (opts == null) {
          opts = {
            trigger: true
          };
        }
        if (Backbone.history._hasPushState) {
          return exports.app.navigate(fr, opts);
        } else {
          if (fr.slice(0, 1) === '!') {
            return exports.app.navigate(fr, opts);
          } else {
            return exports.app.navigate('!/' + fr, opts);
          }
        }
      };

      App.prototype.index = function() {
        this.reRoute();
        return this.view = new views.Index({
          prevView: this.view
        });
      };

      return App;

    })(Backbone.Router);
    return $(document).ready(function() {
      var app;
      console.log('[__app__] init done!');
      exports.app = app = new App();
      app.meta = new views.MetaView({
        el: $('body')
      });
      Backbone.history.start({
        pushState: true
      });
      app.init();
      return $(document).delegate("a", "click", function(e) {
        var uri;
        if (e.currentTarget.getAttribute('href')[0] === '/') {
          uri = Backbone.history._hasPushState ? e.currentTarget.getAttribute('href').slice(1) : "!/" + e.currentTarget.getAttribute('href').slice(1);
          app.navigate(uri, {
            trigger: true
          });
          return false;
        }
      });
    });
  })(window);

}).call(this);
