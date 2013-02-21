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
        self = this.get('_source');
        lastCommit = new Date(self.pushed_at).getTime();
        currentDate = new Date().getTime();
        difference_ms = currentDate - lastCommit;
        datesDifference = Math.round(difference_ms / helpers.oneDay);
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
        score = this.get('_score');
        return score / maxScore;
      },
      /*
              Sets radius of the circles
      */

      radius: function() {
        var watchers;
        watchers = this.get('_source').watchers;
        return 10 + watchers * 5;
      },
      /*
              Color of the bubble
              TODO: make color persist in different searches
      */

      color: function() {
        return this.get('_source').language;
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
    exports.Discovery = this.Backbone.Collection.extend({
      parse: function(r) {
        var _ref;
        return (_ref = r.response) != null ? _ref : [];
      },
      model: models.Discovery,
      url: "/discover/search",
      maxRadius: function() {
        var _this = this;
        return d3.max(this.models, function(data) {
          return data.radius();
        });
      },
      fetch: function() {
        var collection, opts, query, _ref;
        _ref = Array.prototype.slice.apply(arguments), query = _ref[0], opts = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        query = query != null ? query : "";
        collection = this;
        return $.getJSON("" + collection.url + "?q=" + query, function(r) {
          collection.maxScore = r.maxScore;
          return collection.reset(r.searchData);
        });
      }
    });
    return exports.DiscoveryComparison = this.Backbone.Collection.extend({
      model: models.Discovery
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

      View.prototype.tagName = 'section';

      View.prototype.className = 'contents';

      View.prototype.viewsPlaceholder = '#view-wrapper';

      function View(opts) {
        if (opts == null) {
          opts = {};
        }
        if (opts.el == null) {
          opts.el = $("<section class='contents' />");
          if (app.meta.$('.contents').length > 0) {
            app.meta.$('.contents').replaceWith(opts.el);
          } else {
            app.meta.$el.append(opts.el);
          }
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
        return this.render();
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
    /*
      chartClass.prototype.popup = function(action, scope){
          return function(d,i){
            if ( action === 'hide' ){
              popup.hide();
            } else {
              var marginLeft = 50,
                $this = $(this),
                width = height = parseInt($this.attr("r"))*2,
                x = parseInt($this.attr("cx")),
                y = parseInt($this.attr("cy")),
                color = $this.css("fill");
                
              
              var data = d._source,
                stars = data.watchers,            
                lastContribution = humanize.relativeTime(new Date(data.pushed_at).getTime()/1000);
              
              var activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>"+lastContribution+"</strong>"),
                activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>"+stars+" stars</strong> on GitHub"); 
                          
              $(".moduleName", popup).text(data.module_name);
              $(".moduleLanguage", popup)
                .find(".name").text(data.language).end()
                .find(".color").css({background: color});
              $(".moduleDescription", popup).text(data.description);                    
              $(".moduleStars", popup).html("").append(activity, activityStars);
                                    
              popup.show()
                 .css({
                  bottom: (scope.outerHeight()-y-(popup.outerHeight()/2)-15)+'px',
                  left: x+marginLeft+(width/2)+15+'px'
                 });
            }
          }
        }
    */

    /*
      var popup = $("<div />").addClass("popover").hide().appendTo("#searchChart")
                    .append("<h4 class='moduleName' />")
                    .append("<h5 class='moduleLanguage' ><span class='color'></span><span class='name'></span></h5>")
                    .append("<p class='moduleDescription' />")
                    .append("<div class='moduleStars' ></div>");
    */

    exports.DiscoverChartPopup = (function(_super) {

      __extends(DiscoverChartPopup, _super);

      function DiscoverChartPopup() {
        return DiscoverChartPopup.__super__.constructor.apply(this, arguments);
      }

      DiscoverChartPopup.prototype.tagName = "div";

      DiscoverChartPopup.prototype.className = "popover";

      DiscoverChartPopup.prototype.initialize = function() {
        this.moduleName = $("<h4 />").addClass("moduleName");
        this.moduleLanguage = $("<h5 />").addClass("moduleLanguage").append("<span class='color' />").append("<span class='name' />");
        this.moduleDescription = $("<p />").addClass("moduleDescription");
        this.moduleStars = $("<div />").addClass("moduleStars");
        return this.render();
      };

      DiscoverChartPopup.prototype.render = function() {
        this.$el.appendTo(this.options.scope);
        this.$el.hide().append(this.moduleName, this.moduleLanguage, this.moduleDescription, this.moduleStars);
        return this;
      };

      DiscoverChartPopup.prototype.show = function() {
        this.$el.show();
        return this;
      };

      DiscoverChartPopup.prototype.hide = function() {
        this.$el.hide();
        return this;
      };

      DiscoverChartPopup.prototype.setData = function(datum, $this, scope) {
        var activity, activityStars, color, data, height, lastContribution, stars, width, x, y;
        width = height = parseInt($this.attr("r")) * 2;
        x = parseInt($this.attr("cx"));
        y = parseInt($this.attr("cy"));
        color = $this.css("fill");
        data = datum.get("_source");
        stars = data.watchers;
        lastContribution = humanize.relativeTime(new Date(data.pushed_at).getTime() / 1000);
        activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>" + lastContribution + "</strong>");
        activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>" + stars + " stars</strong> on GitHub");
        this.moduleName.text(data.module_name);
        this.moduleLanguage.find(".name").text(data.language).end().find(".color").css({
          background: color
        });
        this.moduleDescription.text(data.description);
        this.moduleStars.html("").append(activity, activityStars);
        this.show();
        return this.$el.css({
          bottom: (this.options.scope.outerHeight() - y - (this.$el.outerHeight() / 2) - 15) + 'px',
          left: x + this.options.margin.left + (width / 2) + 15 + 'px'
        });
      };

      return DiscoverChartPopup;

    })(this.Backbone.View);
    exports.DiscoverComparison = (function(_super) {

      __extends(DiscoverComparison, _super);

      function DiscoverComparison() {
        return DiscoverComparison.__super__.constructor.apply(this, arguments);
      }

      DiscoverComparison.prototype.initialize = function() {
        return this.context = {};
      };

      DiscoverComparison.prototype.render = function() {
        var html;
        html = views['discover/compare'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'discoverComparison');
        return this;
      };

      return DiscoverComparison;

    })(this.Backbone.View);
    exports.DiscoverChart = (function(_super) {

      __extends(DiscoverChart, _super);

      function DiscoverChart() {
        return DiscoverChart.__super__.constructor.apply(this, arguments);
      }

      DiscoverChart.prototype.initialize = function() {
        this.listenTo(this.collection, "reset", this.renderChart);
        this.margin = {
          top: 19.5,
          right: 19.5,
          bottom: 60,
          left: 50
        };
        this.padding = 30;
        this.maxRadius = 50;
        this.width = this.$el.width() - this.margin.right - this.margin.left;
        this.height = this.width * 9 / 16;
        this.xScale = d3.scale.linear().domain([0, 4]).range([0, this.width]);
        this.yScale = d3.scale.linear().domain([0, 1.1]).range([this.height, 0]);
        this.colorScale = d3.scale.category20c();
        _.bindAll(this, "renderChart", "position", "order");
        this.popupView = new exports.DiscoverChartPopup({
          margin: this.margin,
          scope: this.$el
        });
        return this.render();
      };

      DiscoverChart.prototype.setRadiusScale = function() {
        return this.radiusScale = d3.scale.sqrt().domain([10, this.collection.maxRadius()]).range([5, this.maxRadius]);
      };

      DiscoverChart.prototype.formatterX = function(d, i) {
        switch (d) {
          case 0.5:
            return "<1 week ago";
          case 1.5:
            return "< 1 month ago";
          case 2.5:
            return "< 6 months ago";
          case 3.5:
            return "> 6 months ago";
        }
      };

      DiscoverChart.prototype.position = function(dot) {
        var _this = this;
        return dot.attr("cx", function(d) {
          return _this.xScale(d.x());
        }).attr("cy", function(d) {
          return _this.yScale(d.y(_this.collection.maxScore));
        }).attr("r", function(d) {
          return _this.radiusScale(d.radius());
        });
      };

      DiscoverChart.prototype.order = function(a, b) {
        return b.radius() - a.radius();
      };

      DiscoverChart.prototype.popup = function(action, scope) {
        var self;
        self = this;
        return function(d, i) {
          switch (action) {
            case 'hide':
              return self.popupView.hide();
            case 'show':
              return self.popupView.setData(d, $(this), scope);
          }
        };
      };

      DiscoverChart.prototype.addToComparison = function(document, index) {};

      DiscoverChart.prototype.renderChart = function() {
        var _this = this;
        this.setRadiusScale();
        this.dot = this.dots.selectAll(".dot").data(this.collection.models);
        this.dot.enter().append("circle").attr("class", "dot").on("mouseover", this.popup('show', this.$el)).on("mouseout", this.popup('hide')).on("click", this.addToComparison);
        this.dot.transition().style("fill", function(moduleModel) {
          return _this.colorScale(moduleModel.color());
        }).call(this.position);
        this.dot.exit().transition().attr("r", 0).remove();
        this.dot.append("title").text(function(d) {
          return d.get("_source").module_name;
        });
        this.dot.sort(this.order);
        return this;
      };

      DiscoverChart.prototype.render = function() {
        var _this = this;
        this.xAxis = d3.svg.axis().orient("bottom").scale(this.xScale).tickValues([0.5, 1.5, 2.5, 3.5]).tickFormat(this.formatterX);
        this.yAxis = d3.svg.axis().scale(this.yScale).orient("left").tickValues([1]).tickFormat(function(d, i) {
          if (d === 1) {
            return "100%";
          } else {
            return "";
          }
        });
        this.svg = d3.select(this.$el[0]).append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate( " + this.margin.left + " , " + this.margin.top + " )");
        this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0, " + this.height + " )").call(this.xAxis);
        this.svg.append("g").attr("class", "y axis").call(this.yAxis);
        this.svg.append("text").attr("class", "x label").attr("text-anchor", "middle").attr("x", this.width / 2).attr("y", this.height + this.margin.bottom - 10).text("Last commit");
        this.svg.append("text").attr("class", "y label").attr("text-anchor", "middle").attr("y", 6).attr("x", -this.height / 2).attr("dy", "-1em").attr("transform", "rotate(-90)").text("Relevance");
        this.dots = this.svg.append("g").attr("class", "dots");
        return this;
      };

      return DiscoverChart;

    })(View);
    return exports.Discover = (function(_super) {

      __extends(Discover, _super);

      function Discover() {
        return Discover.__super__.constructor.apply(this, arguments);
      }

      Discover.prototype.events = {
        'submit .search-form': 'searchSubmit'
      };

      Discover.prototype.initialize = function() {
        var qs;
        console.log('[__discoverView__] Init');
        _.bindAll(this, "fetchSearchData", "render", "searchSubmit");
        this.context = {
          discover_search_action: "/discover",
          STATIC_URL: app.conf.STATIC_URL
        };
        qs = root.help.qs.parse(location.search);
        if (qs.q != null) {
          this.context.discover_search_query = decodeURI(qs.q);
        }
        this.render();
        /*
                initializing chart
        */

        this.chartData = new root.collections.Discovery;
        this.comparisonData = new root.collections.DiscoveryComparison;
        this.chart = new exports.DiscoverChart({
          el: this.$("#searchChart"),
          collection: this.chartData
        });
        this.comparison = new exorts.DiscoverComparison({
          el: this.$(".moduleComparison"),
          collection: this.comparisonData
        });
        if (qs.q != null) {
          return this.fetchSearchData(qs.q);
        }
      };

      Discover.prototype.searchSubmit = function(e) {
        var pathname, q;
        e.preventDefault();
        q = this.$("[name=q]").val();
        pathname = window.location.pathname;
        app.navigate("" + pathname + "?q=" + q, {
          trigger: false
        });
        return this.fetchSearchData(q);
      };

      Discover.prototype.fetchSearchData = function(query) {
        return this.chart.collection.fetch(query);
      };

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
        var href, uri;
        href = e.currentTarget.getAttribute('href');
        if (href[0] === '/' && !/^\/auth\/.*/i.test(href)) {
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
