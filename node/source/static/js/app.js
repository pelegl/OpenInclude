(function() {

  (function(exports, isServer) {
    var root;
    if (isServer) {
      this.Backbone = require('backbone');
    }
    root = this;
    return exports.qs = {
      stringify: function(obj) {
        var key, string, v, value, _i, _len;
        string = [];
        for (key in obj) {
          value = obj[key];
          if (value != null) {
            if (_.isArray(value)) {
              for (_i = 0, _len = value.length; _i < _len; _i++) {
                v = value[_i];
                if (v != null) {
                  string.push("" + key + "=" + v);
                }
              }
            } else if (_.isObject(value)) {
              continue;
            } else {
              string.push("" + key + "=" + value);
            }
          }
        }
        return string.join('&');
      },
      parse: function(string) {
        var chunk, i, key, result, s, value, _i, _len, _ref;
        s = string.split('?', 2).slice(-1).pop();
        if (s.length <= 1) {
          return {};
        }
        result = {};
        _ref = s.split('&');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          chunk = _ref[_i];
          key = chunk.split('=', 2)[0];
          value = chunk.split('=', 2)[1];
          if (_.indexOf((function() {
            var _results;
            _results = [];
            for (i in result) {
              _results.push(i);
            }
            return _results;
          })(), key) > -1) {
            if (_.isArray(result[key])) {
              result[key].push(value);
            } else {
              result[key] = [result[key], value];
            }
          } else {
            result[key] = value;
          }
        }
        return result;
      }
    };
  }).call(this, (typeof exports === "undefined" ? this["help"] = {} : exports), typeof exports !== "undefined");

}).call(this);

(function() {

  (function(exports, isServer) {
    var helpers;
    if (isServer) {
      this.Backbone = require('backbone');
    }
    helpers = {
      oneDay: 1000 * 60 * 60 * 24
    };
    return exports.Discovery = this.Backbone.Model.extend({
      /*        
          0.5 - super active - up to 7 days
          1.5 - up to 30 days
          2.5 - up to 180 days
          3.5 - more than 180
      */

      idAttribute: "_id",
      x: function() {
        var currentDate, datesDifference, difference_ms, lastCommit, lastCommitBucket, self,
          _this = this;
        self = this._source;
        lastCommit = new Date(self.pushed_at).getTime();
        currentDate = new Date().getTime();
        difference_ms = currentDate - lastCommit;
        datesDifference = Math.round(difference_ms / oneDay);
        lastCommitBucket = function(difference) {
          if (difference > 180) {
            return 3.5;
          } else if (difference <= 7) {
            return 0.5;
          } else if (difference <= 30) {
            return 1.5;
          } else {
            return 2.5;
          }
        };
        return lastCommitBucket(datesDifference);
      },
      /*
              Sets y based on relevance, min: 0, max: 1
      */

      y: function(maxScore) {
        var score;
        score = this._score;
        return score / maxScore;
      },
      /*
              Sets radius of the circles
      */

      radius: function() {
        var watchers;
        watchers = this._source.watchers;
        return 10 + watchers * 5;
      },
      /*
              Color of the bubble
              TODO: make color persist in different searches
      */

      color: function() {
        return this._source.language;
      },
      /*
              Key
      */

      key: function() {
        return this.id;
      }
    });
  }).call(this, (typeof exports === "undefined" ? this["models"] = {} : exports), typeof exports !== "undefined");

}).call(this);

(function() {
  var __slice = [].slice;

  (function(exports, isServer) {
    var api;
    api = "/api/v.1";
    if (isServer) {
      this.Backbone = require('backbone');
    }
    return exports.Discovery = this.Backbone.Collection.extend({
      parse: function(r) {
        var _ref;
        return (_ref = r.response) != null ? _ref : [];
      },
      model: models.Discovery,
      url: "/discovery/search",
      find: function() {
        var a, instance, next, query, _i, _ref;
        _ref = Array.prototype.slice.apply(arguments), query = _ref[0], a = 3 <= _ref.length ? __slice.call(_ref, 1, _i = _ref.length - 1) : (_i = 1, []), next = _ref[_i++];
        query = query != null ? query : "";
        next = next != null ? next : (function() {});
        instance = new this;
        $.getJSON("" + instance.url + "?q=" + query, function(r) {
          var i, _j, _len, _ref1, _ref2;
          if (r.error != null) {
            console.error(r.error);
          }
          _ref2 = (_ref1 = r.response) != null ? _ref1 : [];
          for (_j = 0, _len = _ref2.length; _j < _len; _j++) {
            i = _ref2[_j];
            instance.add(i);
          }
          return next(r.error, instance);
        });
        return instance;
      }
    });
  }).call(this, (typeof exports === "undefined" ? this["collections"] = {} : exports), typeof exports !== "undefined");

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var View, root, views;
    root = this;
    views = this.hbt = Handlebars.partials;
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
    exports.Index = (function(_super) {

      __extends(Index, _super);

      function Index() {
        return Index.__super__.constructor.apply(this, arguments);
      }

      Index.prototype.initialize = function() {
        console.log('[__indexView__] Init');
        this.context = {
          title: "Home Page",
          STATIC_URL: app.conf.STATIC_URL,
          in_stealth_mode: false
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
    exports.DiscoverChart = (function(_super) {

      __extends(DiscoverChart, _super);

      function DiscoverChart() {
        return DiscoverChart.__super__.constructor.apply(this, arguments);
      }

      return DiscoverChart;

    })(View);
    return exports.Discover = (function(_super) {

      __extends(Discover, _super);

      function Discover() {
        return Discover.__super__.constructor.apply(this, arguments);
      }

      Discover.prototype.events = {
        '.search-form submit': 'fetchSearchData'
      };

      Discover.prototype.initialize = function() {
        var qs;
        console.log('[__discoverView__] Init');
        _.bindAll(this, "fetchSearchData", "render", "renderChart");
        this.context = {
          discover_search_action: "/discover",
          STATIC_URL: app.conf.STATIC_URL
        };
        qs = root.help.qs.parse(location.search);
        if (qs.q != null) {
          this.context.discover_search_query = qs.q;
        }
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

      Discover.prototype.fetchSearchData = function() {};

      Discover.prototype.renderChart = function() {};

      Discover.prototype.render = function() {
        var html;
        html = views['discover/index'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'discover');
        return this;
      };

      return Discover;

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
        "discover": "discover",
        "!/discover": "discover"
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

      App.prototype.discover = function() {
        this.reRoute();
        return this.view = new views.Discover({
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
