(function() {

  (function(exports, isServer) {
    var root;
    if (isServer) {
      this.Backbone = require('backbone');
    }
    root = this;
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    exports.exchange = function(view, html) {
      var prevEl;
      prevEl = view.$el;
      view.setElement($(html));
      prevEl.replaceWith(view.$el);
      return prevEl.remove();
    };
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
    exports.Session = this.Backbone.Model.extend({
      idAttribute: "_id",
      url: "/session"
    });
    exports.Bill = this.Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot: "/profile/view_bills"
    });
    exports.Tos = this.Backbone.Model.extend({});
    exports.CreditCard = this.Backbone.Model.extend({});
    exports.User = this.Backbone.Model.extend({
      idAttribute: "_id",
      url: "/session/profile"
    });
    exports.Project = this.Backbone.Model.extend({
      idAttribute: "_id",
      url: "/project"
    });
    exports.Task = this.Backbone.Model.extend({
      idAttribute: "_id",
      url: "/task"
    });
    exports.TaskComment = this.Backbone.Model.extend({
      idAttribute: "_id"
    });
    exports.Language = this.Backbone.Model.extend({
      idAttribute: "name",
      urlRoot: "/modules"
    });
    exports.Repo = this.Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot: "/modules",
      url: function() {
        return "" + this.urlRoot + "/" + (this.get('language')) + "/" + (this.get('owner')) + "|" + (this.get('module_name'));
      }
    });
    exports.StackOverflowQuestion = this.Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot: "/modules",
      url: function() {
        return "" + this.urlRoot + "/all/all/stackoverflow/json/" + (this.get('_id'));
      },
      date: function() {
        return new Date(this.get("timestamp") * 1000);
      },
      x: function() {
        return this.get("timestamp") * 1000;
      },
      y: function() {
        return this.get("amount");
      }
    });
    exports.GithubEvent = this.Backbone.Model.extend({
      idAttribute: "_id",
      urlRoot: "/modules",
      url: function() {
        return "" + this.urlRoot + "/all/all/github_events/json/" + (this.get('_id'));
      },
      x: function() {
        return new Date(this.get("created_at"));
      }
    });
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
        return "#" + this.get('color');
      },
      /*
        Key
      */

      key: function() {
        return this.id;
      },
      /*
        last commit - human
      */

      lastCommitHuman: function() {
        return humanize.relativeTime(new Date(this.get('_source').pushed_at).getTime() / 1000);
      },
      /*
        overwrite toJSON, so we can add attributes from functions for hbs
      */

      toJSON: function(options) {
        var attr;
        attr = _.clone(this.attributes);
        attr.lastCommitHuman = this.lastCommitHuman();
        return attr;
      }
    });
  }).call(this, (typeof exports === "undefined" ? this["models"] = {} : exports), typeof exports !== "undefined");

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  (function(exports, isServer) {
    var api, requestPager;
    api = "/api/v.1";
    if (isServer) {
      this.Backbone = require('backbone');
    }
    requestPager = (function(_super) {

      __extends(requestPager, _super);

      function requestPager() {
        return requestPager.__super__.constructor.apply(this, arguments);
      }

      requestPager.prototype.toJSON = function(options) {
        return this.cache[this.currentPage] || [];
      };

      requestPager.prototype.goTo = function(page, options) {
        var response;
        if (page !== void 0) {
          this.currentPage = parseInt(page, 10);
          if (this.cache[this.currentPage] != null) {
            this.info();
            this.trigger("sync");
          } else {
            return this.pager(options);
          }
        } else {
          response = new $.Deferred();
          response.reject();
          return response.promise();
        }
      };

      requestPager.prototype.cache = {};

      requestPager.prototype.paginator_core = {
        type: 'GET',
        dataType: 'json',
        url: function() {
          if (typeof this.url !== 'function') {
            return "" + this.url + "?";
          }
          return "" + (this.url()) + "?";
        }
      };

      requestPager.prototype.paginator_ui = {
        firstPage: 0,
        currentPage: 0,
        perPage: 30
      };

      requestPager.prototype.server_api = {
        'page': function() {
          return this.currentPage;
        },
        'limit': function() {
          return this.perPage;
        }
      };

      requestPager.prototype.preload_data = function(page, limit, data, total_count) {
        this.cache[page] = data;
        this.reset(data, {
          silent: true
        });
        return this.bootstrap({
          totalRecords: parseInt(total_count),
          perPage: limit,
          currentPage: page
        });
      };

      return requestPager;

    })(this.Backbone.Paginator.requestPager);
    exports.Language = requestPager.extend({
      comparator: function(language) {
        return language.get("name");
      },
      model: models.Language,
      url: "/modules",
      parse: function(response) {
        var languages;
        this.cache[this.currentPage] = languages = response.languages;
        this.totalRecords = response.total_count;
        return languages;
      }
    });
    exports.Modules = requestPager.extend({
      initialize: function(models, options) {
        return this.language = options.language || "";
      },
      comparator: function(module) {
        return module.get("watchers");
      },
      model: models.Repo,
      url: function() {
        return "/modules/" + this.language;
      },
      parse: function(response) {
        var modules;
        this.cache[this.currentPage] = modules = response.modules;
        this.totalRecords = response.total_count;
        return modules;
      }
    });
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
      languageList: function() {
        var languageNames, list,
          _this = this;
        languageNames = this.groupedModules ? _.keys(this.groupedModules) : [];
        list = [];
        _.each(languageNames, function(lang) {
          return list.push({
            name: lang,
            color: _this.groupedModules[lang][0].color
          });
        });
        return list;
      },
      filters: {},
      fetch: function() {
        var collection, opts, query, _ref;
        _ref = Array.prototype.slice.apply(arguments), query = _ref[0], opts = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        query = query != null ? query : "";
        collection = this;
        return $.getJSON("" + collection.url + "?q=" + query, function(r) {
          var _this = this;
          collection.maxScore = r.maxScore;
          collection.groupedModules = _.groupBy(r.searchData, function(module) {
            return module._source.language;
          });
          return collection.reset(r.searchData);
        });
      }
    });
    exports.DiscoveryComparison = this.Backbone.Collection.extend({
      model: models.Discovery,
      sortBy: function(key, direction) {
        var _this = this;
        key = key != null ? key.split(".") : "_id";
        this.models = _.sortBy(this.models, function(module) {
          var asked, value;
          value = key.length === 2 ? module.get(key[0])[key[1]] : module.get(key[0]);
          if (key[1] === 'pushed_at') {
            return new Date(value);
          } else if (key[0] === 'answered') {
            asked = module.get("asked");
            if (asked === 0) {
              return 0;
            } else {
              return value / asked;
            }
          } else {
            return value;
          }
        });
        if (direction === "DESC") {
          this.models.reverse();
        }
        return this.trigger("sort");
      }
    });
    exports.Projects = this.Backbone.Collection.extend({
      model: models.Project,
      url: "/project"
    });
    exports.Tasks = this.Backbone.Collection.extend({
      model: models.Task,
      url: "/task"
    });
    exports.Bills = this.Backbone.Collection.extend({
      model: models.Bill,
      url: "/profile/view_bills"
    });
    exports.GithubEvents = this.Backbone.Collection.extend({
      model: models.GithubEvent,
      initialize: function(options) {
        if (options == null) {
          options = {};
        }
        this.language = options.language, this.owner = options.owner, this.repo = options.repo;
        this.language || (this.language = "");
        this.repo || (this.repo = "");
        return this.owner || (this.owner = "");
      },
      url: function() {
        return "/modules/" + this.language + "/" + this.owner + "|" + this.repo + "/github_events/json";
      }
    });
    return exports.StackOverflowQuestions = this.Backbone.Collection.extend({
      model: models.StackOverflowQuestion,
      chartMap: function(name) {
        return {
          name: name,
          values: this.where({
            key: name
          })
        };
      },
      parse: function(r) {
        var items, maxTS, questions,
          _this = this;
        this.statistics = r.statistics, questions = r.questions;
        if (!(questions.length > 0)) {
          return [];
        }
        /*
          Add normalization
        */

        items = [];
        _.each(this.statistics.keys, function(key) {
          var list;
          list = _.where(questions, {
            key: key
          });
          return items.push(_.last(list));
        });
        maxTS = _.max(items, function(item) {
          return item.timestamp;
        });
        _.each(items, function(item) {
          var i;
          i = _.extend({}, item);
          i.timestamp = maxTS.timestamp;
          i._id += "_copy";
          return questions.push(i);
        });
        return questions;
      },
      keys: function() {
        return this.statistics.keys || [];
      },
      initialize: function(options) {
        if (options == null) {
          options = {};
        }
        _.bindAll(this, "chartMap");
        this.language = options.language, this.owner = options.owner, this.repo = options.repo;
        this.language || (this.language = "");
        this.repo || (this.repo = "");
        return this.owner || (this.owner = "");
      },
      url: function() {
        return "/modules/" + this.language + "/" + this.owner + "|" + this.repo + "/stackoverflow/json";
      }
    });
  }).call(this, (typeof exports === "undefined" ? this["collections"] = {} : exports), typeof exports !== "undefined");

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var View, col, root, views;
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
    col = root.collections;
    exports.NotFound = (function(_super) {

      __extends(NotFound, _super);

      function NotFound() {
        return NotFound.__super__.constructor.apply(this, arguments);
      }

      NotFound.prototype.className = "error-404";

      NotFound.prototype.render = function() {
        this.$el.html("Error 404 - not found");
        return this;
      };

      return NotFound;

    })(this.Backbone.View);
    exports.MetaView = (function(_super) {

      __extends(MetaView, _super);

      function MetaView() {
        return MetaView.__super__.constructor.apply(this, arguments);
      }

      MetaView.prototype.events = {};

      MetaView.prototype.initialize = function() {
        this.Languages = new col.Language;
        return console.log('[__metaView__] Init');
      };

      return MetaView;

    })(this.Backbone.View);
    exports.Loader = (function(_super) {

      __extends(Loader, _super);

      function Loader() {
        return Loader.__super__.constructor.apply(this, arguments);
      }

      Loader.prototype.tagName = 'img';

      Loader.prototype.attributes = {
        src: "/static/images/loader.gif"
      };

      return Loader;

    })(this.Backbone.View);
    exports.Agreement = (function(_super) {

      __extends(Agreement, _super);

      function Agreement() {
        return Agreement.__super__.constructor.apply(this, arguments);
      }

      Agreement.prototype.tagName = 'div';

      Agreement.prototype.className = 'row-fluid agreementContainer';

      Agreement.prototype.events = {
        'submit form': 'processSubmit'
      };

      Agreement.prototype.show = function() {
        return this.$el.show();
      };

      Agreement.prototype.hide = function() {
        return this.$el.hide();
      };

      Agreement.prototype.processSubmit = function(e) {
        var isChecked;
        e.preventDefault();
        /*
          Perform async form process
        */

        isChecked = this.$("[name=signed]").prop("checked");
        if (isChecked) {
          this.model.save({
            signed: "signed"
          });
        } else {

        }
        return false;
      };

      Agreement.prototype.signed = function() {
        return app.navigate(app.conf.profile_url, {
          trigger: true
        });
      };

      Agreement.prototype.initialize = function() {
        var action, agreement, _ref;
        this.model = new models.Tos;
        if ($(".agreementContainer").length > 0) {
          this.setElement($(".agreementContainer"));
        } else {
          this.render();
        }
        _ref = this.options, agreement = _ref.agreement, action = _ref.action;
        this.listenTo(this, "init", this.niceScroll);
        this.listenTo(this.model, "sync", this.signed);
        return this.setData(agreement, action);
      };

      Agreement.prototype.renderData = function() {
        var output;
        output = views['member/agreement'](this.context);
        this.$el.html($(output).unwrap().html());
        return this.trigger("init");
      };

      Agreement.prototype.setData = function(agreement, action) {
        console.log(arguments);
        this.context = {
          agreement_text: agreement,
          agreement_signup_action: action
        };
        this.model.url = this.context.agreement_signup_action;
        return this.renderData();
      };

      Agreement.prototype.niceScroll = function() {
        if (this.$(".agreementText").is(":visible")) {
          this.$(".agreementText").niceScroll();
        }
        return this.delegateEvents();
      };

      Agreement.prototype.render = function() {
        var html;
        html = views['member/agreement'](this.context || {});
        this.$el = $(html);
        this.delegateEvents();
        return this;
      };

      return Agreement;

    })(this.Backbone.View);
    root.View = View = (function(_super) {

      __extends(View, _super);

      View.prototype.tagName = 'section';

      View.prototype.className = 'contents';

      View.prototype.viewsPlaceholder = '#view-wrapper';

      function View(opts) {
        if (opts == null) {
          opts = {};
        }
        this.context = _.extend({}, app.conf);
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
        this.context.title = "Home Page";
        return this.render();
      };

      Index.prototype.render = function() {
        var html;
        html = views['index'](this.context, null, this.context.partials);
        this.$el.html(html);
        this.$el.attr('view-id', 'index');
        return this;
      };

      return Index;

    })(View);
    return exports.ShareIdeas = (function(_super) {

      __extends(ShareIdeas, _super);

      function ShareIdeas() {
        return ShareIdeas.__super__.constructor.apply(this, arguments);
      }

      ShareIdeas.prototype.events = {
        'click .share-ideas': 'toggleShow',
        'click .close': 'toggleShow',
        'click .submit': 'submit'
      };

      ShareIdeas.prototype.initialize = function() {
        return console.log('[__ShareIdeasView__] Init');
      };

      ShareIdeas.prototype.toggleShow = function() {
        return $('.share-common').toggleClass('show');
      };

      ShareIdeas.prototype.submit = function() {
        var $email, $ideas, $self;
        $email = $('#email');
        $ideas = $('#ideas');
        $self = $('.submit');
        $self.addClass('disabled');
        $self.html("<img src=\"" + app.conf.STATIC_URL + "images/loader.gif\" alt=\"Loading...\" class=\"loader\" />");
        return $.post('/share-idea', {
          email: $email.val(),
          ideas: $ideas.val()
        }, function(data) {
          if (data.status === 'success') {
            $self.html('Success');
          } else {
            $self.html('Error occured');
          }
          return setTimeout(function() {
            $('.share-common').toggleClass('show');
            return setTimeout(function() {
              $self.removeClass('disabled').html('Submit');
              $email.val('');
              return $ideas.val('');
            }, 500);
          }, 1000);
        });
      };

      return ShareIdeas;

    })(this.Backbone.View);
  }).call(this, window.views = {});

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  (function(exports) {
    var agreement_text, root, views;
    agreement_text = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. ";
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
    exports.SignIn = (function(_super) {

      __extends(SignIn, _super);

      function SignIn() {
        return SignIn.__super__.constructor.apply(this, arguments);
      }

      SignIn.prototype.initialize = function() {
        console.log('[_signInView__] Init');
        this.context.title = "Authentication";
        return this.render();
      };

      SignIn.prototype.render = function() {
        this.$el.html(views['registration/login'](this.context));
        this.$el.attr('view-id', 'registration');
        return this;
      };

      return SignIn;

    })(View);
    exports.Bill = (function(_super) {

      __extends(Bill, _super);

      function Bill() {
        return Bill.__super__.constructor.apply(this, arguments);
      }

      Bill.prototype.className = "bill";

      Bill.prototype.initialize = function() {
        return this.render();
      };

      Bill.prototype.render = function() {
        var bill, html;
        bill = this.model.toJSON();
        html = views['member/bill']({
          bill: bill
        });
        help.exchange(this, html);
        return this;
      };

      return Bill;

    })(this.Backbone.View);
    exports.Bills = (function(_super) {

      __extends(Bills, _super);

      function Bills() {
        return Bills.__super__.constructor.apply(this, arguments);
      }

      Bills.prototype.className = "bills";

      Bills.prototype.initialize = function() {
        this.collection = new collections.Bills;
        this.listenTo(this.collection, "sync", this.render);
        return this.collection.fetch();
      };

      Bills.prototype.render = function() {
        var bills, html, view_bills;
        view_bills = app.conf.view_bills;
        bills = this.collection.toJSON();
        html = views['member/bills']({
          bills: bills,
          view_bills: view_bills
        });
        help.exchange(this, html);
        return this;
      };

      return Bills;

    })(this.Backbone.View);
    exports.CC = (function(_super) {

      __extends(CC, _super);

      function CC() {
        return CC.__super__.constructor.apply(this, arguments);
      }

      CC.prototype.className = "dropdown-menu";

      CC.prototype.events = {
        'click  form': "stopPropagation",
        'submit form': "updateCardData"
      };

      CC.prototype.stopPropagation = function(e) {
        console.log("prop");
        return e.stopPropagation();
      };

      CC.prototype.updateCardData = function(e) {
        var data;
        e.preventDefault();
        data = Backbone.Syphon.serialize(e.currentTarget);
        this.$("[type=submit]").addClass("disabled").text("Updating information...");
        this.model.set(data);
        this.model.save(null, {
          success: this.processUpdate,
          error: this.processUpdate
        });
        return false;
      };

      CC.prototype.processUpdate = function(model, response, options) {
        if (response.success === true) {
          return app.session.set({
            has_stripe: true
          });
        } else {

        }
      };

      CC.prototype.initialize = function() {
        var $el;
        this.model = new models.CreditCard;
        this.model.url = app.conf.update_credit_card;
        _.bindAll(this, "processUpdate");
        this.context = _.extend({}, app.conf);
        $el = $(".setupPayment .dropdown-menu");
        if ($el.length > 0) {
          return this.setElement($el);
        } else {
          return this.render();
        }
      };

      CC.prototype.render = function() {
        var html;
        html = views['member/credit_card'](this.context);
        this.$el.html($(html).html());
        return this;
      };

      return CC;

    })(this.Backbone.View);
    return exports.Profile = (function(_super) {

      __extends(Profile, _super);

      function Profile() {
        return Profile.__super__.constructor.apply(this, arguments);
      }

      Profile.prototype.events = {
        'click a[class*=backbone]': "processAction",
        'click .setupPayment > button': "update_cc_events"
      };

      Profile.prototype.update_cc_events = function(e) {
        this.cc.delegateEvents();
        return $(e.currentTarget).dropdown('toggle');
      };

      Profile.prototype.clearHref = function(href) {
        return href.replace("/" + this.context.profile_url, "");
      };

      Profile.prototype.processAction = function(e) {
        var $this, action, href, _ref;
        $this = $(e.currentTarget);
        href = this.clearHref($this.attr("href"));
        _ref = _.without(href.split("/"), ""), action = _ref[0], this.get = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
        this.setAction("/" + action);
        return false;
      };

      Profile.prototype.empty = function() {
        var opts;
        opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        this.informationBox.children().detach();
        if (opts != null) {
          return this.informationBox.append(opts);
        }
      };

      Profile.prototype.setAction = function(action) {
        var billId, bills, dev, findBill, merc, navigateTo, trello, _ref,
          _this = this;
        dev = this.clearHref(this.context.developer_agreement);
        merc = this.clearHref(this.context.merchant_agreement);
        trello = this.clearHref(this.context.trello_auth_url);
        bills = this.clearHref(this.context.view_bills);
        if (action === dev && app.session.get("employee") === false) {
          /*
            show developer license agreement
          */

          app.navigate(this.context.developer_agreement, {
            trigger: false
          });
          this.agreement.$el.show();
          return this.agreement.setData(agreement_text, this.context.developer_agreement);
        } else if (action === merc && app.session.get("merchant") === false) {
          /*
            show client license agreement
          */

          app.navigate(this.context.merchant_agreement, {
            trigger: false
          });
          this.empty(this.agreement.$el);
          this.agreement.show();
          this.agreement.setData(agreement_text, this.context.merchant_agreement);
          return this.listenTo(this.agreement.model, "sync", this.setupPayment);
        } else if (action === trello) {
          /*
                	  	navigate to Trello authorization
          */

          return app.navigate(this.context.trello_auth_url, {
            trigger: true
          });
        } else if (action === bills) {
          /*
            navigate to view bills
          */

          console.log(this.get);
          if (!(((_ref = this.get) != null ? _ref.length : void 0) > 0)) {
            navigateTo = this.context.view_bills;
            this.empty(this.bills.$el);
          } else {
            navigateTo = "" + this.context.view_bills + "/" + (this.get.join("/"));
            billId = this.get[0];
            findBill = function() {
              var bill, billView;
              bill = _this.bills.collection.get(billId);
              if (bill) {
                billView = new exports.Bill({
                  model: bill
                });
                return _this.empty(billView.$el);
              } else {
                _this.bills.collection.once("sync", findBill);
                return _this.empty((new exports.NotFound()).$el);
              }
            };
            findBill();
          }
          return app.navigate(navigateTo, {
            trigger: false
          });
        } else {
          /*
            hide agreement and navigate back to profile
          */

          this.informationBox.children().detach();
          return app.navigate(this.context.profile_url, {
            trigger: false
          });
        }
      };

      Profile.prototype.initialize = function(options) {
        console.log('[__profileView__] Init');
        this.get = options.opts || [];
        if (options.profile) {
          this.model = new models.User;
          this.model.url = "/session/profile/" + options.profile;
          this.context.title = "Profile of " + this.profile;
          this.context["private"] = false;
        } else {
          this.context.title = "Personal Profile";
          this.context["private"] = true;
          this.agreement = new exports.Agreement;
          this.cc = new exports.CC;
          this.bills = new exports.Bills;
        }
        this.listenTo(this.model, "change", this.render);
        this.model.fetch();
        return this.render();
      };

      Profile.prototype.render = function() {
        var html;
        console.log("Rendering profile view");
        console.log("action: ", this.options.action, this.get);
        this.context.user = this.model.toJSON();
        html = views['member/profile'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'profile');
        this.informationBox = this.$(".informationBox");
        if (this.cc) {
          this.cc.setElement(this.$(".setupPayment .dropdown-menu"));
          this.cc.$el.prev().dropdown();
        }
        if (this.context["private"]) {
          this.setAction(this.options.action);
        }
        return this;
      };

      return Profile;

    })(View);
  }).call(this, window.views);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var root, views;
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
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
        this.moduleName.text("" + data.owner + "/" + data.module_name);
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
    exports.DiscoverFilter = (function(_super) {

      __extends(DiscoverFilter, _super);

      function DiscoverFilter() {
        return DiscoverFilter.__super__.constructor.apply(this, arguments);
      }

      DiscoverFilter.prototype.events = {
        "change input[type=checkbox]": "filterResults",
        "click [data-reset]": "resetFilter"
      };

      DiscoverFilter.prototype.initialize = function() {
        _.bindAll(this, "render");
        this.context = {
          filters: [
            {
              name: "Language",
              key: "languageFilters"
            }
          ]
        };
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "reset", this.resetFilter);
        return this.render();
      };

      DiscoverFilter.prototype.resetFilter = function(e) {
        var $this;
        if ((e != null ? e.currentTarget : void 0) != null) {
          $this = $(e.currentTarget);
          $this.closest(".filterBox").find("input[type=checkbox]").prop("checked", false);
        }
        this.collection.filters = [];
        this.collection.trigger("filter");
        return false;
      };

      DiscoverFilter.prototype.filterResults = function(e) {
        var $this, languageName;
        $this = $(e.currentTarget);
        languageName = $this.val();
        if ($this.is(":checked")) {
          this.collection.filters[languageName] = true;
        } else {
          delete this.collection.filters[languageName];
        }
        return this.collection.trigger("filter");
      };

      DiscoverFilter.prototype.render = function() {
        var html;
        this.context.filters[0].languages = this.collection.languageList();
        html = views['discover/filter'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'discoverFilter');
        return this;
      };

      return DiscoverFilter;

    })(this.Backbone.View);
    exports.DiscoverComparison = (function(_super) {

      __extends(DiscoverComparison, _super);

      function DiscoverComparison() {
        return DiscoverComparison.__super__.constructor.apply(this, arguments);
      }

      DiscoverComparison.prototype.events = {
        "click [data-sort]": "sortComparison"
      };

      DiscoverComparison.prototype.sortComparison = function(e) {
        var $this, direction, index, key,
          _this = this;
        $this = $(e.currentTarget);
        /*
          sort key
        */

        key = $this.data("sort");
        /*
          set active on the element in the context, remove active from the previous element
        */

        index = $this.closest("th").index();
        /*
          get sort direction
        */

        direction = this.context.headers[index].directionBottom === true ? "ASC" : "DESC";
        _.each(this.context.headers, function(v, k) {
          v.active = false;
          return v.directionBottom = true;
        });
        this.context.headers[index].active = true;
        this.context.headers[index].directionBottom = direction === "DESC" ? true : false;
        this.collection.sortBy(key, direction);
        return false;
      };

      DiscoverComparison.prototype.initialize = function() {
        _.bindAll(this, "render");
        this.listenTo(this.collection, "all", this.render);
        this.context = {
          headers: [
            {
              name: "Project Name",
              key: "_source.module_name"
            }, {
              name: "Language",
              key: "_source.language"
            }, {
              name: "Active Contributors"
            }, {
              name: "Last Commit",
              key: "_source.pushed_at"
            }, {
              name: "Stars on GitHub",
              key: "_source.watchers"
            }, {
              name: "Questions on StackOverflow",
              key: "asked"
            }, {
              name: "Percentage answered",
              key: "answered"
            }
          ]
        };
        return this.render();
      };

      DiscoverComparison.prototype.render = function() {
        var html;
        this.context.projects = this.collection.toJSON();
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
        this.listenTo(this.collection, "filter", this.renderChart);
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

      DiscoverChart.prototype.addToComparison = function(document, index) {
        return app.view.comparisonData.add(document);
      };

      DiscoverChart.prototype.renderChart = function() {
        var data, languages,
          _this = this;
        this.setRadiusScale();
        languages = _.keys(this.collection.filters);
        if (languages.length > 0) {
          data = this.collection.filter(function(module) {
            return $.inArray(module.get("_source").language, languages) !== -1;
          });
        } else {
          data = this.collection.models;
        }
        this.dot = this.dots.selectAll(".dot").data(data);
        this.dot.enter().append("circle").attr("class", "dot").on("mouseover", this.popup('show', this.$el)).on("mouseout", this.popup('hide')).on("click", this.addToComparison);
        this.dot.transition().style("fill", function(moduleModel) {
          return moduleModel.color();
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
        qs = root.help.qs.parse(location.search);
        if (qs.q != null) {
          this.context.discover_search_query = decodeURI(qs.q);
        }
        this.context.discover_search_action = "/discover";
        this.render();
        /*
          initializing chart
        */

        this.chartData = new root.collections.Discovery;
        this.comparisonData = new root.collections.DiscoveryComparison;
        this.filter = new exports.DiscoverFilter({
          el: this.$(".filter"),
          collection: this.chartData
        });
        this.chart = new exports.DiscoverChart({
          el: this.$("#searchChart"),
          collection: this.chartData
        });
        this.comparison = new exports.DiscoverComparison({
          el: this.$("#moduleComparison"),
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
  }).call(this, window.views);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var root, views;
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
    return exports.HowTo = (function(_super) {

      __extends(HowTo, _super);

      function HowTo() {
        return HowTo.__super__.constructor.apply(this, arguments);
      }

      HowTo.prototype.initialize = function() {
        console.log('[__HowToView__] Init');
        return this.render();
      };

      HowTo.prototype.render = function() {
        var html;
        html = views['how-to'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'how-to');
        return this;
      };

      return HowTo;

    })(View);
  }).call(this, window.views);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(exports) {
    var modules_url, qs, root, views;
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
    qs = root.help.qs;
    modules_url = "/modules";
    exports.Series = (function(_super) {

      __extends(Series, _super);

      function Series() {
        return Series.__super__.constructor.apply(this, arguments);
      }

      Series.prototype.initialize = function(opts) {
        var className,
          _this = this;
        if (opts == null) {
          opts = {};
        }
        _.bindAll(this);
        console.log(opts);
        this.types = opts.types, this.title = opts.title;
        this.margin = {
          top: 20,
          right: 100,
          bottom: 30,
          left: 50
        };
        this.width = this.$el.width() - this.margin.right - this.margin.left;
        this.height = 300 - this.margin.top - this.margin.bottom;
        this.x = d3.time.scale().range([0, this.width]);
        this.y = d3.scale.linear().range([this.height, 0]);
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
        this.yAxis = d3.svg.axis().scale(this.y).orient("left");
        this.line = d3.svg.line().x(function(d) {
          return _this.x(d.x());
        }).y(function(d) {
          return _this.y(d.y);
        });
        className = this.$el.attr("class");
        return this.svg = d3.select("." + className).append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      };

      Series.prototype.render = function() {
        /*
        TODO: fix data
        */

        var data, prev,
          _this = this;
        data = this.collection.filter(function(item) {
          var _ref;
          return _ref = item.get("type"), __indexOf.call(_this.types, _ref) >= 0;
        });
        prev = 0;
        data.forEach(function(d) {
          return d.y = ++prev;
        });
        this.x.domain(d3.extent(data, function(d) {
          return d.x();
        }));
        this.y.domain(d3.extent(data, function(d) {
          return d.y;
        }));
        this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")").call(this.xAxis);
        this.svg.append("g").attr("class", "y axis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(this.title);
        return this.svg.append("path").datum(data).attr("class", "line").attr("d", this.line);
      };

      return Series;

    })(this.Backbone.View);
    /*
      @constructor
      Multi series chart view
    */

    exports.MultiSeries = (function(_super) {

      __extends(MultiSeries, _super);

      function MultiSeries() {
        return MultiSeries.__super__.constructor.apply(this, arguments);
      }

      MultiSeries.prototype.initialize = function(opts) {
        var className,
          _this = this;
        if (opts == null) {
          opts = {};
        }
        _.bindAll(this);
        this.margin = {
          top: 20,
          right: 200,
          bottom: 30,
          left: 50
        };
        this.width = this.$el.width() - this.margin.right - this.margin.left;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.x = d3.time.scale().range([0, this.width]);
        this.y = d3.scale.linear().range([this.height, 0]);
        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
        this.yAxis = d3.svg.axis().scale(this.y).orient("left");
        this.color = d3.scale.category10();
        this.line = d3.svg.line().x(function(d) {
          return _this.x(d.x());
        }).y(function(d) {
          return _this.y(d.y());
        });
        className = this.$el.attr("class");
        return this.svg = d3.select("." + className).append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      };

      MultiSeries.prototype.render = function() {
        var max, min, question, questions,
          _this = this;
        this.color.domain(this.collection.keys());
        questions = this.color.domain().map(this.collection.chartMap);
        this.x.domain(d3.extent(this.collection.models, function(d) {
          return d.x();
        }));
        min = d3.min(questions, function(c) {
          return d3.min(c.values, function(v) {
            return v.y();
          });
        });
        max = d3.max(questions, function(c) {
          return d3.max(c.values, function(v) {
            return v.y();
          });
        });
        this.y.domain([0.5 * min, 1.1 * max]);
        this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")").call(this.xAxis);
        this.svg.append("g").attr("class", "y axis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Questions");
        question = this.svg.selectAll(".question").data(questions).enter().append("g").attr("class", "question");
        question.append("path").attr("class", "line").attr("d", function(d) {
          return _this.line(d.values);
        }).style("stroke", function(d) {
          return _this.color(d.name);
        });
        question.append("text").datum(function(d) {
          return {
            name: d.name,
            value: d.values[d.values.length - 1]
          };
        }).attr("transform", function(d) {
          var x, y;
          x = d.value != null ? _this.x(d.value.x()) : 0;
          y = d.value != null ? _this.y(d.value.y()) : 0;
          return "translate(" + x + "," + y + ")";
        }).attr("x", 10).attr("dy", ".35em").text(function(d) {
          if (d.value != null) {
            return d.name;
          } else {
            return "";
          }
        });
        return this;
      };

      return MultiSeries;

    })(this.Backbone.View);
    /*
      @constructor
      Repository view
    */

    exports.Repo = (function(_super) {

      __extends(Repo, _super);

      function Repo() {
        return Repo.__super__.constructor.apply(this, arguments);
      }

      Repo.prototype.events = {};

      Repo.prototype.initialize = function(opts) {
        var preloadedData, repo, _ref;
        if (opts == null) {
          opts = {};
        }
        this.language = opts.language, repo = opts.repo;
        try {
          _ref = decodeURI(repo).split("|"), this.owner = _ref[0], this.repo = _ref[1];
          if (!this.owner || !this.repo) {
            throw "Incorrect link";
          }
        } catch (e) {
          console.log(e);
        }
        this.model = new models.Repo({
          language: this.language,
          module_name: this.repo,
          owner: this.owner
        });
        /*
          context
        */

        this.context = {
          modules_url: modules_url
        };
        /*
          events
        */

        _.bindAll(this);
        this.listenTo(this.model, "sync", this.render);
        this.listenTo(this.model, "sync", this.initCharts);
        this.collections = {};
        this.charts = {};
        /*
          setup render and load data
        */

        preloadedData = this.$("[data-repo]");
        if (preloadedData.length > 0) {
          this.model.set(preloadedData.data("repo"), {
            silent: true
          });
          this.render();
          return this.initCharts();
        } else {
          return this.model.fetch();
        }
      };

      Repo.prototype.initCharts = function() {
        /*
          inits
        */
        this.initSO();
        this.initGE();
        /*
          Setup listeners
        */

        this.listenTo(this.collections.stackOverflow, "sync", this.charts.stackOverflow.render);
        this.listenTo(this.collections.githubEvents, "sync", this.charts.githubCommits.render);
        this.listenTo(this.collections.githubEvents, "sync", this.charts.githubWatchers.render);
        /*
          Start fetching data
        */

        this.collections.stackOverflow.fetch();
        return this.collections.githubEvents.fetch();
      };

      Repo.prototype.initSO = function() {
        var options, so;
        options = {
          language: this.language,
          owner: this.owner,
          repo: this.repo
        };
        this.collections.stackOverflow = so = new collections.StackOverflowQuestions(options);
        return this.charts.stackOverflow = new exports.MultiSeries({
          el: this.$(".stackQAHistory"),
          collection: so
        });
      };

      Repo.prototype.initGE = function() {
        var ge, options;
        options = {
          language: this.language,
          owner: this.owner,
          repo: this.repo
        };
        this.collections.githubEvents = ge = new collections.GithubEvents(options);
        this.charts.githubCommits = new exports.Series({
          el: this.$(".commitHistory"),
          collection: ge,
          types: ["PushEvent"],
          title: "Commits over time"
        });
        return this.charts.githubWatchers = new exports.Series({
          el: this.$(".starsHistory"),
          collection: ge,
          types: ["WatchEvent"],
          title: "Watchers over time"
        });
      };

      Repo.prototype.render = function() {
        var html;
        this.context.module = this.model.toJSON();
        html = views['module/view'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'module-list');
        return this;
      };

      return Repo;

    })(View);
    exports.ModuleList = (function(_super) {

      __extends(ModuleList, _super);

      function ModuleList() {
        return ModuleList.__super__.constructor.apply(this, arguments);
      }

      ModuleList.prototype.events = {
        'click .pagination a': "changePage"
      };

      ModuleList.prototype.initialize = function(opts) {
        var data, limit, page, preloadedData, _ref;
        console.log('[__ModuleListView__] Init');
        this.language = opts.language;
        this.context = {
          modules_url: modules_url,
          language: this.language.capitalize()
        };
        _ref = qs.parse(window.location.search), page = _ref.page, limit = _ref.limit;
        page = page ? parseInt(page) : 0;
        limit = limit ? parseInt(limit) : 30;
        /*
          Init collection
        */

        this.collection = new collections.Modules(null, {
          language: this.language
        });
        this.listenTo(this.collection, "sync", this.render);
        preloadedData = this.$("[data-modules]");
        if (preloadedData.length > 0) {
          data = preloadedData.data("modules");
          this.collection.preload_data(page, limit, data.modules, data.total_count);
          return this.render();
        } else {
          this.$el.append(new exports.Loader);
          return this.collection.pager();
        }
      };

      ModuleList.prototype.changePage = function(e) {
        var href, loader, page, view;
        href = $(e.currentTarget).attr("href");
        if (href) {
          page = href.replace(/.*page=([0-9]+).*/, "$1");
          page = page ? parseInt(page) : 0;
          delete this.context.prev;
          delete this.context.next;
          view = this.$("ul[data-modules]");
          view.height(view.height());
          loader = new exports.Loader().$el;
          view.html("").append($("<li />").append(loader));
          return this.collection.goTo(page, {
            update: true,
            remove: false
          });
        }
      };

      ModuleList.prototype.render = function() {
        var currentPage, html, i, totalPages, _i, _ref;
        this.context.modules = this.collection.toJSON();
        _ref = this.collection.info(), totalPages = _ref.totalPages, currentPage = _ref.currentPage;
        if (totalPages > 0) {
          this.context.pages = [];
          for (i = _i = 1; 1 <= totalPages ? _i <= totalPages : _i >= totalPages; i = 1 <= totalPages ? ++_i : --_i) {
            this.context.pages.push({
              text: i,
              link: i - 1,
              isActive: currentPage + 1 === i
            });
          }
          if (currentPage > 0) {
            this.context.prev = (currentPage - 1).toString();
          }
          if (totalPages - 1 > currentPage) {
            this.context.next = currentPage + 1;
          }
        } else {
          delete this.context.pages;
        }
        html = views['module/modules'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'module-list');
        return this;
      };

      return ModuleList;

    })(View);
    return exports.Languages = (function(_super) {

      __extends(Languages, _super);

      function Languages() {
        return Languages.__super__.constructor.apply(this, arguments);
      }

      Languages.prototype.events = {
        'click .pagination a': "changePage"
      };

      Languages.prototype.initialize = function() {
        var data, limit, page, preloadedData, _ref;
        console.log('[__ModuleViewInit__] Init');
        /*
          Context
        */

        this.context.modules_url = modules_url;
        /*
          QS limits
        */

        _ref = qs.parse(window.location.search), page = _ref.page, limit = _ref.limit;
        page = page ? parseInt(page) : 0;
        limit = limit ? parseInt(limit) : 30;
        this.collection = app.meta.Languages;
        this.listenTo(this.collection, "sync", this.render);
        /*
          Pager setup
        */

        preloadedData = this.$("[data-languages]");
        if (preloadedData.length > 0) {
          data = preloadedData.data("languages");
          this.collection.preload_data(page, limit, data.languages, data.total_count);
          return this.render();
        } else {
          this.$el.append(new exports.Loader);
          return this.collection.pager();
        }
      };

      Languages.prototype.changePage = function(e) {
        var href, loader, page, view;
        href = $(e.currentTarget).attr("href");
        if (href) {
          page = href.replace(/.*page=([0-9]+).*/, "$1");
          page = page ? parseInt(page) : 0;
          delete this.context.prev;
          delete this.context.next;
          view = this.$("ul[data-languages]");
          view.height(view.height());
          loader = new exports.Loader().$el;
          view.html("").append($("<li />").append(loader));
          return this.collection.goTo(page, {
            update: true,
            remove: false
          });
        }
      };

      Languages.prototype.render = function() {
        var currentPage, html, i, totalPages, _i, _ref;
        this.context.languages = this.collection.toJSON();
        _ref = this.collection.info(), totalPages = _ref.totalPages, currentPage = _ref.currentPage;
        if (totalPages > 0) {
          this.context.pages = [];
          for (i = _i = 1; 1 <= totalPages ? _i <= totalPages : _i >= totalPages; i = 1 <= totalPages ? ++_i : --_i) {
            this.context.pages.push({
              text: i,
              link: i - 1,
              isActive: currentPage + 1 === i
            });
          }
          if (currentPage > 0) {
            this.context.prev = (currentPage - 1).toString();
          }
          if (totalPages - 1 > currentPage) {
            this.context.next = currentPage + 1;
          }
        } else {
          delete this.context.pages;
        }
        html = views['module/index'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'language-list');
        return this;
      };

      return Languages;

    })(View);
  }).call(this, window.views);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(exports) {
    var InlineForm, Search, Task, TypeAhead, Users, project, projectId, projects, root, task, taskEl, taskId, tasks, views;
    root = this;
    views = this.hbt = _.extend({}, dt, Handlebars.partials);
    projects = new collections.Projects;
    tasks = new collections.Tasks;
    projectId = "";
    project = null;
    taskId = "";
    task = null;
    taskEl = null;
    Users = (function(_super) {

      __extends(Users, _super);

      function Users() {
        return Users.__super__.constructor.apply(this, arguments);
      }

      Users.prototype.model = models.User;

      Users.prototype.url = "/session/list";

      return Users;

    })(this.Backbone.Collection);
    TypeAhead = (function(_super) {

      __extends(TypeAhead, _super);

      function TypeAhead() {
        return TypeAhead.__super__.constructor.apply(this, arguments);
      }

      TypeAhead.prototype.el = "#typeahead";

      TypeAhead.prototype.events = {
        'click li.suggestion': "select"
      };

      TypeAhead.prototype.initialize = function(context) {
        if (context == null) {
          context = {};
        }
        this.context = context;
        this.suggestions = new Users;
        return this.listenTo(this.suggestions, "reset", this.render);
      };

      TypeAhead.prototype.position = function(element) {
        var height, offset, width;
        offset = $(element).offset();
        width = $(element).width();
        height = $(element).height();
        this.$el.css('left', offset.left);
        this.$el.css('top', offset.top + height);
        if (!this.context.listener) {
          return this.context.listener = element;
        }
      };

      TypeAhead.prototype.select = function(event) {
        var value;
        value = $(event.target).attr("rel");
        value = $(this.context.listener).val() + value + " ";
        $(this.context.listener).val(value);
        return this.hide();
      };

      TypeAhead.prototype.showUser = function() {
        this.base = "/session/list";
        return this.suggestions.url = "/session/list";
      };

      TypeAhead.prototype.showProject = function() {
        this.base = "project/suggest";
        return this.suggestions.url = "/project/suggest";
      };

      TypeAhead.prototype.showTask = function(part) {};

      TypeAhead.prototype.updateQuery = function(part) {
        if (part.length > 2) {
          this.suggestions.url = "" + this.base + "/" + part;
          console.log(this.suggestions.url);
          return this.suggestions.fetch();
        }
      };

      TypeAhead.prototype.hide = function() {
        this.$el.hide();
        return this.available = false;
      };

      TypeAhead.prototype.render = function() {
        var html;
        this.context.suggestions = this.suggestions.toJSON();
        html = views['dashboard/typeahead'](this.context);
        this.$el.html(html);
        this.$el.show();
        this.available = true;
        return this;
      };

      return TypeAhead;

    })(this.Backbone.View);
    InlineForm = (function(_super) {

      __extends(InlineForm, _super);

      function InlineForm() {
        return InlineForm.__super__.constructor.apply(this, arguments);
      }

      InlineForm.prototype.events = {
        'submit form': "submit",
        'click button[type=submit]': "preventPropagation",
        'click .close-inline': "hide",
        'keypress textarea.typeahead': "typeahead"
      };

      InlineForm.prototype.preventPropagation = function(event) {
        return event.stopPropagation();
      };

      InlineForm.prototype.initialize = function(context) {
        if (context == null) {
          context = {};
        }
        this.context = _.extend({}, context, app.conf);
        InlineForm.__super__.initialize.call(this, context);
        this.tah = new TypeAhead(this.context);
        return this.render();
      };

      InlineForm.prototype.typeahead = function(event) {
        var char, code;
        code = event.which || event.keyCode || event.charCode;
        char = String.fromCharCode(code);
        this.tah.position(event.target);
        switch (char) {
          case '@':
            this.buf = '';
            return this.tah.showUser();
          case '#':
            this.buf = '';
            return this.tah.showTask();
          case '+':
            this.buf = '';
            return this.tah.showProject();
          case ' ':
            this.buf = '';
            return this.tah.hide();
          default:
            if (code === 8) {
              this.buf = this.buf.substring(0, this.buf.length - 1);
              return true;
            }
            if (event.charCode === 0) {
              return true;
            }
            this.buf += char;
            if (this.buf.length > 0) {
              return this.tah.updateQuery(this.buf);
            }
        }
      };

      InlineForm.prototype.submit = function(event) {
        var data;
        event.preventDefault();
        event.stopPropagation();
        data = Backbone.Syphon.serialize(event.currentTarget);
        this.$("[type=submit]").addClass("disabled").text("Updating information...");
        this.model.save(data, {
          success: this.success,
          error: this.success
        });
        return false;
      };

      InlineForm.prototype.success = function(model, response, options) {
        if (response.success === true) {
          this.hide;
          return true;
        } else {
          console.log(response);
          alert("An error occured");
          return false;
        }
      };

      InlineForm.prototype.show = function() {
        this.$el.show();
        return this.$("form input").focus();
      };

      InlineForm.prototype.hide = function(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        return this.$el.hide();
      };

      InlineForm.prototype.render = function() {
        this.html = views[this.view](this.context);
        this.$el.hide();
        this.$el.html("");
        this.$el.append(this.html);
        return this;
      };

      return InlineForm;

    })(this.Backbone.View);
    exports.CreateProjectForm = (function(_super) {

      __extends(CreateProjectForm, _super);

      function CreateProjectForm() {
        return CreateProjectForm.__super__.constructor.apply(this, arguments);
      }

      CreateProjectForm.prototype.el = "#create-project-inline";

      CreateProjectForm.prototype.view = "dashboard/create_project";

      CreateProjectForm.prototype.success = function(model, response, options) {
        if (CreateProjectForm.__super__.success.call(this, model, response, options)) {
          projectId = response.id;
          return projects.fetch();
        }
      };

      CreateProjectForm.prototype.initialize = function(context) {
        this.model = new models.Project;
        return CreateProjectForm.__super__.initialize.call(this, context);
      };

      return CreateProjectForm;

    })(InlineForm);
    exports.EditProjectForm = (function(_super) {

      __extends(EditProjectForm, _super);

      function EditProjectForm() {
        return EditProjectForm.__super__.constructor.apply(this, arguments);
      }

      EditProjectForm.prototype.el = ".main-area";

      EditProjectForm.prototype.view = "dashboard/edit_project";

      EditProjectForm.prototype.success = function(model, response, options) {
        if (EditProjectForm.__super__.success.call(this, model, response, options)) {
          return projects.fetch();
        }
      };

      EditProjectForm.prototype.initialize = function(context) {
        this.model = context.model;
        this.model.url = "/project/" + context.projectId;
        return EditProjectForm.__super__.initialize.call(this, context);
      };

      return EditProjectForm;

    })(InlineForm);
    exports.CreateTaskForm = (function(_super) {

      __extends(CreateTaskForm, _super);

      function CreateTaskForm() {
        return CreateTaskForm.__super__.constructor.apply(this, arguments);
      }

      CreateTaskForm.prototype.el = "#create-task-inline";

      CreateTaskForm.prototype.view = "dashboard/create_task";

      CreateTaskForm.prototype.success = function(model, response, options) {
        if (CreateTaskForm.__super__.success.call(this, model, response, options)) {
          return tasks.fetch();
        }
      };

      CreateTaskForm.prototype.initialize = function() {
        this.model = new models.Task;
        this.model.url = "/task/" + projectId;
        return CreateTaskForm.__super__.initialize.call(this);
      };

      return CreateTaskForm;

    })(InlineForm);
    exports.CreateTaskCommentForm = (function(_super) {

      __extends(CreateTaskCommentForm, _super);

      function CreateTaskCommentForm() {
        return CreateTaskCommentForm.__super__.constructor.apply(this, arguments);
      }

      CreateTaskCommentForm.prototype.view = "dashboard/create_task_comment";

      CreateTaskCommentForm.prototype.success = function(model, response, options) {
        if (CreateTaskCommentForm.__super__.success.call(this, model, response, options)) {
          return tasks.fetch();
        }
      };

      CreateTaskCommentForm.prototype.initialize = function(context) {
        this.model = new models.TaskComment;
        this.model.url = "/task/comment/" + taskId;
        return CreateTaskCommentForm.__super__.initialize.call(this, context);
      };

      return CreateTaskCommentForm;

    })(InlineForm);
    Task = (function(_super) {

      __extends(Task, _super);

      function Task() {
        return Task.__super__.constructor.apply(this, arguments);
      }

      Task.prototype.events = {
        'click #task-check-in': "checkIn",
        'click #task-check-out': "checkOut",
        'click #task-finish': "finish"
      };

      Task.prototype.checkIn = function(event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        $(event.target).attr("id", "task-check-out");
        $(event.target).html("Check out");
        this.currentTime = moment();
        this.stop = false;
        return $.get("/task/time/start/" + taskId + "/" + (this.currentTime.unix()), function(result, text, xhr) {
          if (result.success) {
            return setTimeout(_.bind(_this.timer, _this), 1000);
          } else {
            return alert(result.error);
          }
        });
      };

      Task.prototype.checkOut = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(event.target).attr("id", "task-check-in");
        $(event.target).html("Check in");
        this.stop = true;
        return $.get("/task/time/end/" + taskId + "/" + (moment().unix()), function(result, text, xhr) {
          if (!result.success) {
            return alert(result.error);
          }
        });
      };

      Task.prototype.finish = function(event) {
        return this;
      };

      Task.prototype.timer = function() {
        var diff, hours, minutes, seconds;
        if (!this.timerEl) {
          this.timerEl = $("#timer");
        }
        diff = moment().diff(this.currentTime, "seconds");
        hours = Math.floor(diff / 3600);
        minutes = Math.floor(diff / 60) - hours * 3600;
        seconds = Math.floor(diff) - minutes * 60 - hours * 3600;
        this.timerEl.html("" + hours + ":" + minutes + ":" + seconds);
        if (!this.stop) {
          return setTimeout(_.bind(this.timer, this), 1000);
        }
      };

      Task.prototype.initialize = function(context) {
        this.context = context;
        Task.__super__.initialize.call(this, context);
        return this.render();
      };

      Task.prototype.render = function() {
        var html;
        html = views['dashboard/task'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'dashboard-task');
        return this;
      };

      return Task;

    })(View);
    Search = (function(_super) {

      __extends(Search, _super);

      function Search() {
        return Search.__super__.constructor.apply(this, arguments);
      }

      Search.prototype.events = {
        'submit form': "submit",
        'click button[type=submit]': "preventPropagation"
      };

      Search.prototype.preventPropagation = function(event) {
        return event.stopPropagation();
      };

      Search.prototype.submit = function(event) {
        var data;
        event.preventDefault();
        event.stopPropagation();
        data = Backbone.Syphon.serialize(event.currentTarget);
        this.tasks = new collections.Tasks;
        this.listenTo(this.tasks, "reset", this.renderResult);
        if (!data.from) {
          data.from = "none";
        }
        if (!data.to) {
          data.to = "none";
        }
        this.tasks.url = "/task/search/" + data.search + "/" + data.from + "/" + data.to;
        return this.tasks.fetch();
      };

      Search.prototype.initialize = function(context) {
        this.context = context;
        Search.__super__.initialize.call(this, context);
        return this.render();
      };

      Search.prototype.renderResult = function(collection) {
        var _tasks;
        _tasks = [];
        collection.each(function(item) {
          return _tasks.push(item.toJSON());
        });
        this.context.tasks = _tasks;
        return this.render();
      };

      Search.prototype.render = function() {
        var from, html, to;
        html = views['dashboard/search'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'dashboard-search');
        from = this.$el.find("input[name=from]");
        to = this.$el.find("input[name=to]");
        from.datepicker({
          onClose: function(selectedDate) {
            return to.datepicker("option", "minDate", selectedDate);
          }
        });
        to.datepicker({
          onClose: function(selectedDate) {
            return from.datepicker("option", "maxDate", selectedDate);
          }
        });
        return this;
      };

      return Search;

    })(View);
    return exports.Dashboard = (function(_super) {

      __extends(Dashboard, _super);

      function Dashboard() {
        return Dashboard.__super__.constructor.apply(this, arguments);
      }

      Dashboard.prototype.events = {
        'click .project-list li a': "editProject",
        'click .project-list li': "switchProject",
        'click #create-project-button': "showProjectForm",
        'click #create-subproject-button': "showSubProjectForm",
        'click #delete-project-button': "deleteProject",
        'click #create-task-button': "showTaskForm",
        'click #task-add-comment-button': "showTaskCommentForm",
        'click #task-list li': "openTask"
      };

      Dashboard.prototype.clearHref = function(href) {
        return href.replace("/" + this.context.dashboard_url, "");
      };

      Dashboard.prototype.parsePermissions = function(user, project) {
        var _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        this.context.canRead = false;
        this.context.canWrite = false;
        this.context.canGrant = false;
        this.context.isOwner = false;
        if (user._id === project.client.id) {
          this.context.isOwner = true;
        }
        _ref = project.read;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          user = _ref[_i];
          if (user.id === this.context.user._id) {
            this.context.canRead = true;
            break;
          }
        }
        _ref1 = project.write;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          user = _ref1[_j];
          if (user.id === this.context.user._id) {
            this.context.canWrite = true;
            break;
          }
        }
        _ref2 = project.grant;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          user = _ref2[_k];
          if (user.id === this.context.user._id) {
            this.context.canGrant = true;
            break;
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Dashboard.prototype.openTask = function(e) {
        if (typeof e !== 'object') {
          taskId = e;
        } else {
          e.preventDefault();
          e.stopPropagation();
          taskId = e.target.attributes['rel'].value;
        }
        task = tasks.get(taskId);
        app.navigate("/dashboard/project/" + projectId + "/task/" + taskId, {
          trigger: false
        });
        this.context.task = task.toJSON();
        this.context.el = "#main-area";
        return this.taskView = new Task(this.context);
      };

      Dashboard.prototype.editProject = function(e) {
        var editProjectForm;
        e.preventDefault();
        e.stopPropagation();
        projectId = e.target.attributes['rel'].value;
        project = projects.get(projectId);
        this.context.projectId = projectId;
        this.context.project = project.toJSON();
        this.context.model = project;
        this.parsePermissions(this.context.user, this.context.project);
        editProjectForm = new exports.EditProjectForm(this.context);
        return editProjectForm.show();
      };

      Dashboard.prototype.deleteProject = function(e) {
        var _this = this;
        e.preventDefault();
        project.url = "/project/" + projectId;
        return project.destroy({
          success: function(model, response) {
            _this.context.project = null;
            _this.context.projectId = "";
            project = null;
            projectId = "";
            return projects.fetch();
          }
        });
      };

      Dashboard.prototype.showSubProjectForm = function(e) {
        e.preventDefault();
        if (this.createProject != null) {
          this.createProject.undelegateEvents();
        }
        this.createProject = new exports.CreateProjectForm(this.context);
        return this.createProject.show();
      };

      Dashboard.prototype.showProjectForm = function(e) {
        e.preventDefault();
        this.context.project = null;
        if (this.createProject != null) {
          this.createProject.undelegateEvents();
        }
        this.createProject = new exports.CreateProjectForm(this.context);
        return this.createProject.show();
      };

      Dashboard.prototype.showTaskForm = function(e) {
        e.preventDefault();
        if (this.createTask != null) {
          this.createTask.undelegateEvents();
        }
        this.createTask = new exports.CreateTaskForm(this.context);
        return this.createTask.show();
      };

      Dashboard.prototype.showTaskCommentForm = function(e) {
        var createTaskComment;
        e.preventDefault();
        e.stopPropagation();
        createTaskComment = new exports.CreateTaskCommentForm(_.extend(this.context, {
          el: "#task-add-comment-" + taskId
        }));
        return createTaskComment.show();
      };

      Dashboard.prototype.switchProject = function(e) {
        if (typeof e !== 'object') {
          projectId = e;
        } else {
          projectId = e.target.attributes['rel'].value;
        }
        project = projects.get(projectId);
        this.context.projectId = projectId;
        this.context.project = project.toJSON();
        this.parsePermissions(this.context.user, this.context.project);
        app.navigate("/dashboard/project/" + projectId, {
          trigger: false
        });
        taskId = null;
        tasks.url = "/task/" + projectId;
        return tasks.fetch();
      };

      Dashboard.prototype.initialize = function(params) {
        console.log('[__dashboardView__] Init');
        this.context.title = "Dashboard";
        this.context.user = app.session.toJSON();
        this.context.canEdit = function(user, project) {
          var _i, _len, _ref, _user;
          if (user._id === project.client.id) {
            return true;
          }
          _ref = project.write;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _user = _ref[_i];
            if (_user.id === user._id) {
              return true;
            }
          }
          return false;
        };
        this.listenTo(projects, "reset", this.updateProjectList, this);
        this.listenTo(tasks, "reset", this.updateTaskList, this);
        projectId = params.project;
        taskId = params.task;
        return projects.fetch();
      };

      Dashboard.prototype.updateProjectList = function(collection) {
        var _projects;
        _projects = [];
        collection.each(function(item) {
          return _projects.push(item.toJSON());
        });
        this.context.projects = _projects;
        if (projectId) {
          if (taskId) {
            tasks.url = "/task/" + projectId;
            tasks.fetch();
          } else {
            return this.switchProject(projectId);
          }
        }
        return this.render();
      };

      Dashboard.prototype.updateTaskList = function(collection) {
        var _tasks;
        _tasks = [];
        collection.each(function(item) {
          return _tasks.push(item.toJSON());
        });
        this.context.tasks = _tasks;
        if (taskId) {
          return this.openTask(taskId);
        }
        return this.render();
      };

      Dashboard.prototype.setParent = function(parent, child) {
        return $.get("/project/parent/" + parent + "/" + child, function(response, status, xhr) {
          return projects.fetch();
        });
      };

      Dashboard.prototype.render = function() {
        var html,
          _this = this;
        html = views['dashboard/dashboard'](this.context);
        this.$el.html(html);
        this.$el.attr('view-id', 'dashboard');
        $(".project-list li").droppable({
          drop: function(event, ui) {
            return _this.setParent(event.target.attributes['rel'].value, ui.draggable.attr("rel"));
          }
        }).draggable({
          containment: "parent"
        });
        if (!(projectId || taskId)) {
          this.searchView = new Search(_.extend(this.context, {
            el: "#main-area"
          }));
        }
        return this;
      };

      return Dashboard;

    })(View);
  }).call(this, window.views);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  (function(exports) {
    var App, conf;
    conf = {
      STATIC_URL: "/static/",
      in_stealth_mode: false,
      logout_url: "/auth/logout",
      profile_url: "profile",
      signin_url: "profile/login",
      github_auth_url: "/auth/github",
      trello_auth_url: "/auth/trello",
      discover_url: "discover",
      how_to_url: "how-to",
      modules_url: 'modules',
      merchant_agreement: '/profile/merchant_agreement',
      developer_agreement: '/profile/developer_agreement',
      update_credit_card: '/profile/update_credit_card',
      dashboard_url: "dashboard",
      create_project_url: "dashboard/project/create",
      partials: window.dt,
      admin_url: "admin",
      view_bills: "/profile/view_bills",
      create_bills: "/admin/create_bills",
      users_with_stripe: "/admin/users_with_stripe"
    };
    App = (function(_super) {

      __extends(App, _super);

      function App() {
        return App.__super__.constructor.apply(this, arguments);
      }

      App.prototype.conf = conf;

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

      App.prototype.profile = function() {
        var action, opts;
        action = arguments[0], opts = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        this.reRoute();
        if (app.session.get("is_authenticated") === true) {
          if (action === 'view') {
            return this.view = new views.Profile({
              prevView: this.view,
              model: app.session,
              action: "/" + action,
              profile: opts[0]
            });
          } else {
            return this.view = new views.Profile({
              prevView: this.view,
              model: app.session,
              action: "/" + action,
              opts: opts
            });
          }
        } else {
          return app.navigate('/profile/login', {
            trigger: true
          });
        }
      };

      App.prototype['how-to'] = function() {
        this.reRoute();
        return this.view = new views.HowTo({
          prevView: this.view
        });
      };

      App.prototype.login = function() {
        this.reRoute();
        console.log("login", app.session.get("is_authenticated") === true);
        if (app.session.get("is_authenticated") === true) {
          return app.navigate('/profile', {
            trigger: true
          });
        } else {
          return this.view = new views.SignIn({
            prevView: this.view
          });
        }
      };

      App.prototype.discover = function() {
        this.reRoute();
        return this.view = new views.Discover({
          prevView: this.view
        });
      };

      App.prototype.language_list = function() {
        this.reRoute();
        return this.view = new views.Languages({
          el: $('.contents'),
          prevView: this.view
        });
      };

      App.prototype.repo_list = function(language) {
        this.reRoute();
        return this.view = new views.ModuleList({
          el: $('.contents'),
          prevView: this.view,
          language: language
        });
      };

      App.prototype.repo = function(language, repo) {
        this.reRoute();
        return this.view = new views.Repo({
          el: $('.contents'),
          prevView: this.view,
          language: language,
          repo: repo
        });
      };

      App.prototype.dashboard = function() {
        this.reRoute();
        if (app.session.get("is_authenticated")) {
          return this.view = new views.Dashboard({
            prevView: this.view
          });
        } else {
          return app.navigate(app.conf.signin_url, {
            trigger: true
          });
        }
      };

      App.prototype.project = function(id) {
        this.reRoute();
        if (app.session.get("is_authenticated")) {
          return this.view = new views.Dashboard({
            prevView: this.view,
            project: id
          });
        } else {
          return app.navigate(app.conf.signin_url, {
            trigger: true
          });
        }
      };

      App.prototype.task = function(project, task) {
        this.reRoute();
        if (app.session.get("is_authenticated")) {
          return this.view = new views.Dashboard({
            prevView: this.view,
            project: project,
            task: task
          });
        } else {
          return app.navigate(app.conf.signin_url, {
            trigger: true
          });
        }
      };

      return App;

    })(Backbone.Router);
    return $(document).ready(function() {
      var app, route_keys, route_paths,
        _this = this;
      route_keys = ["", "!/", conf.discover_url, "!/" + conf.discover_url, conf.signin_url, "!/" + conf.signin_url, conf.profile_url, "!/" + conf.profile_url, "" + conf.profile_url + "/:action", "" + conf.profile_url + "/:action/:profile", "!/" + conf.profile_url + "/:action", "!/" + conf.profile_url + "/:action/:profile", conf.how_to_url, "!/" + conf.how_to_url, conf.modules_url, "!/" + conf.modules_url, "" + conf.modules_url + "/:language", "!/" + conf.modules_url + "/:language", "" + conf.modules_url + "/:language/:repo", "!/" + conf.modules_url + "/:language/:repo", conf.dashboard_url, "!/" + conf.dashboard_url, "dashboard/project/:id", "!/dashboard/project/:id", "dashboard/project/:project/task/:task", "!/dashboard/project/:project/task/:task"];
      route_paths = ["index", "index", "discover", "discover", "login", "login", "profile", "profile", "profile", "profile", "profile", "profile", "how-to", "how-to", "language_list", "language_list", "repo_list", "repo_list", "repo", "repo", "dashboard", "dashboard", "project", "project", "task", "task"];
      App.prototype.routes = _.object(route_keys, route_paths);
      console.log('[__app__] init done!');
      exports.app = app = new App();
      app.meta = new views.MetaView({
        el: $('body')
      });
      app.shareIdeas = new views.ShareIdeas({
        el: $('.share-common')
      });
      app.session = new models.Session();
      app.session.fetch();
      return app.session.once("sync", function() {
        Backbone.history.start({
          pushState: true
        });
        app.init();
        return $(document).delegate("a", "click", function(e) {
          var href, path, search, uri;
          href = e.currentTarget.getAttribute('href');
          if (!href) {
            return true;
          }
          if (href[0] === '/' && !/^\/auth\/.*/i.test(href)) {
            uri = Backbone.history._hasPushState ? e.currentTarget.getAttribute('href').slice(1) : "!/" + e.currentTarget.getAttribute('href').slice(1);
            app.navigate(uri, {
              trigger: true
            });
            return false;
          } else if (href[0] === '?') {
            path = window.location.pathname;
            search = href;
            app.navigate("" + path + search, {
              trigger: false
            });
            return false;
          }
        });
      });
    });
  })(window);

}).call(this);
