(function(exports, isServer) {
  var root;

  if (isServer) {
    this.Backbone = require('backbone');
  }
  root = this;
  root.models = {};
  root.collections = {};
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  String.prototype.getTimestamp = function() {
    return new Date(parseInt(this.slice(0, 8), 16) * 1000);
  };
  exports.oneDay = 1000 * 60 * 60 * 24;
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

var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

models.User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  User.prototype.idAttribute = "github_username";

  User.prototype.urlRoot = "/session/profile";

  return User;

})(Backbone.Model);

var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

models.Session = (function(_super) {
  __extends(Session, _super);

  function Session() {
    _ref = Session.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
   @param {String}   github_id
   @param {Boolean}  has_stripe
   @param {Array}    payment_methods
   @param {Boolean}  merchant
   @param {Boolean}  employee
   @param {String}   github_display_name
   @param {String}   github_email
   @param {String}   github_username
   @param {String}   github_avatar_url
   @param {String}   trello_id
   @param {ObjectId} _id
   @param {Boolean}  is_authenticated
  */


  Session.prototype.url = "/session";

  Session.prototype.initialize = function() {
    return this.load();
  };

  Session.prototype.isSuperUser = function() {
    return this.get("group_id") === 'admin';
  };

  Session.prototype.parse = function(response, options) {
    var github_avatar_url, github_display_name;

    if (response.is_authenticated) {
      /*
       set cookie for consiquent sign in attempts
      */

      github_display_name = response.github_display_name, github_avatar_url = response.github_avatar_url;
      this.user = {
        github_display_name: github_display_name,
        github_avatar_url: github_avatar_url
      };
      $.cookie("returning_customer", {
        user: this.user
      }, {
        expires: 30
      });
    }
    return response;
  };

  Session.prototype.unload = function() {
    delete this.user;
    return $.removeCookie("returning_customer");
  };

  Session.prototype.load = function() {
    var cookie;

    cookie = $.cookie("returning_customer");
    if (cookie != null) {
      this.user = cookie.user;
    }
    return this.fetch();
  };

  return Session;

})(models.User);

models.StackOverflowQuestion = Backbone.Model.extend({
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

models.GithubEvent = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/modules",
  url: function() {
    return "" + this.urlRoot + "/all/all/github_events/json/" + (this.get('_id'));
  },
  x: function() {
    return new Date(this.get("created_at"));
  }
});

models.Discovery = Backbone.Model.extend({
  /*
      0.5 - super active - up to 7 days
      1.5 - up to 30 days
      2.5 - up to 180 days
      3.5 - more than 180
  */

  idAttribute: "_id",
  x: function() {
    var currentDate, datesDifference, difference_ms, interpolate, lastCommit, max, maxDifference, min, minDifference, self;

    self = this.get('_source');
    lastCommit = new Date(self.pushed_at).getTime();
    currentDate = new Date().getTime();
    difference_ms = currentDate - lastCommit;
    datesDifference = Math.round(difference_ms / help.oneDay);
    /*
      We interpolate data in the buckets, so that
        0.25 to 1 is the 1st bucket,
        1 to 1.75 is the second,
        1.75 to 3 is the 3rd,
        3 to 5 is the last one
    */

    interpolate = function(min, max, minDifference, maxDifference, value) {
      var curPoint, diff, pnt;

      diff = max - min;
      pnt = diff / (maxDifference - minDifference);
      curPoint = pnt * (value - minDifference) + min;
      if (curPoint < max) {
        return curPoint;
      } else {
        return max;
      }
    };
    if (datesDifference > 180) {
      min = 3;
      max = 5;
      minDifference = 180;
      maxDifference = 720;
    } else if (datesDifference <= 7) {
      min = 0.25;
      max = 1;
      minDifference = 0;
      maxDifference = 7;
    } else if (datesDifference <= 30) {
      min = 1;
      max = 1.75;
      minDifference = 7;
      maxDifference = 30;
    } else {
      min = 1.75;
      max = 3;
      minDifference = 30;
      maxDifference = 180;
    }
    return interpolate(min, max, minDifference, maxDifference, datesDifference);
    /*
    return new Date(self.pushed_at)
    */

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
    return watchers;
  },
  /*
    Color of the bubble
    TODO: make color persist in different searches
  */

  color: function() {
    return "#" + this.get('color');
  },
  /*
    name
  */

  name: function() {
    return this.get("_source").module_name;
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

models.Bill = Backbone.Model.extend({
  /*
   user
   amount
   description
  */

  idAttribute: "_id",
  urlRoot: "/profile/bills",
  validate: function(attrs, options) {
    var errors;

    errors = [];
    if (!attrs.bill) {
      errors.push("Internal error - error 001");
    } else {
      if (!attrs.bill.user) {
        errors.push("Missing user information - error 002");
      }
      if (!attrs.bill.amount) {
        errors.push({
          name: "amount",
          msg: "Please, specify amount"
        });
      } else if (!/^[0-9]+(\.[0-9]+)?\$?$/.test(attrs.bill.amount)) {
        errors.push({
          name: "amount",
          msg: "Amount should only contain digits and a dot"
        });
      }
      if (!attrs.bill.description) {
        errors.push({
          name: "description",
          msg: "Please, specify bill description"
        });
      }
    }
    if (errors.length > 0) {
      return errors;
    }
  }
});

models.Tos = Backbone.Model.extend({});

models.CreditCard = Backbone.Model.extend({});

models.Project = Backbone.Model.extend({
  idAttribute: "_id",
  url: "/project"
});

models.Task = Backbone.Model.extend({
  idAttribute: "_id",
  url: "/task"
});

models.TaskComment = Backbone.Model.extend({
  idAttribute: "_id"
});

models.Language = Backbone.Model.extend({
  idAttribute: "name",
  urlRoot: "/modules"
});

models.Repo = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/modules",
  url: function() {
    return "" + this.urlRoot + "/" + (this.get('language')) + "/" + (this.get('owner')) + "|" + (this.get('module_name'));
  }
});

var _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

collections.requestPager = (function(_super) {
  __extends(requestPager, _super);

  function requestPager() {
    _ref = requestPager.__super__.constructor.apply(this, arguments);
    return _ref;
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

})(Backbone.Paginator.requestPager);

collections.UsersWithStripe = Backbone.Collection.extend({
  model: models.User,
  url: "/session/users_with_stripe",
  parse: function(response) {
    var err, success, users;

    success = response.success, err = response.err, users = response.users;
    if (success !== true) {
      return [];
    }
    return users;
  },
  initialize: function() {
    return this.fetch();
  }
});

collections.StackOverflowQuestions = Backbone.Collection.extend({
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

collections.Users = Backbone.Collection.extend({
  model: models.User,
  url: "/session/list"
});

collections.Language = collections.requestPager.extend({
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

collections.Modules = collections.requestPager.extend({
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

var __slice = [].slice;

collections.Discovery = Backbone.Collection.extend({
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
  getBestMatch: function() {
    return this.findWhere({
      _score: this.maxScore
    });
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

collections.DiscoveryComparison = Backbone.Collection.extend({
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

collections.Projects = Backbone.Collection.extend({
  model: models.Project,
  url: "/project"
});

collections.Tasks = Backbone.Collection.extend({
  model: models.Task,
  url: "/task"
});

collections.Bills = Backbone.Collection.extend({
  model: models.Bill,
  urlRoot: "/profile/bills",
  initialize: function(models, options) {
    if (models == null) {
      models = [];
    }
    if (options == null) {
      options = {};
    }
    return this.options = options;
  },
  url: function() {
    if (!this.options.user) {
      return "" + this.urlRoot;
    }
    return "" + this.urlRoot + "/for/" + (this.options.user.get('github_username'));
  },
  comparator: function(bill) {
    return -bill.get("_id").getTimestamp();
  }
});

collections.GithubEvents = Backbone.Collection.extend({
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(exports) {
  var View, col, root, views, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  col = root.collections;
  exports.NotFound = (function(_super) {
    __extends(NotFound, _super);

    function NotFound() {
      _ref = NotFound.__super__.constructor.apply(this, arguments);
      return _ref;
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
      _ref1 = MetaView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    MetaView.prototype.events = {
      'submit .navbar-search': 'searchSubmit'
    };

    MetaView.prototype.searchSubmit = function(e) {
      var location, pathname, q, trigger;

      e.preventDefault();
      q = this.$("[name=q]").val();
      location = window.location.pathname;
      pathname = $(e.currentTarget).attr("action");
      trigger = location === pathname ? false : true;
      app.navigate("" + pathname + "?q=" + q, {
        trigger: trigger
      });
      if (!trigger) {
        app.view.fetchSearchData(q);
      }
      return false;
    };

    MetaView.prototype.initialize = function() {
      this.Languages = new col.Language;
      return console.log('[__metaView__] Init');
    };

    return MetaView;

  })(this.Backbone.View);
  exports.Loader = (function(_super) {
    __extends(Loader, _super);

    function Loader() {
      _ref2 = Loader.__super__.constructor.apply(this, arguments);
      return _ref2;
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
      _ref3 = Agreement.__super__.constructor.apply(this, arguments);
      return _ref3;
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
      var action, agreement, _ref4;

      this.model = new models.Tos;
      if ($(".agreementContainer").length > 0) {
        this.setElement($(".agreementContainer"));
      } else {
        this.render();
      }
      _ref4 = this.options, agreement = _ref4.agreement, action = _ref4.action;
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
      _ref4 = Index.__super__.constructor.apply(this, arguments);
      return _ref4;
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
  exports.ShareIdeas = (function(_super) {
    __extends(ShareIdeas, _super);

    function ShareIdeas() {
      _ref5 = ShareIdeas.__super__.constructor.apply(this, arguments);
      return _ref5;
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
  exports.Bill = (function(_super) {
    __extends(Bill, _super);

    function Bill() {
      _ref6 = Bill.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    Bill.prototype.className = "bill";

    Bill.prototype.initialize = function() {
      var bill, billId;

      _.bindAll(this, "initialize");
      billId = this.options.billId;
      bill = this.model || this.collection.get(billId);
      if (bill) {
        this.model = bill;
        this.listenTo(this.model, "sync", this.render);
        return this.render();
      } else {
        return this.collection.once("sync", this.initialize);
      }
    };

    Bill.prototype.render = function() {
      var html;

      html = views['member/bill']({
        bill: this.model.toJSON(),
        user: app.session.toJSON()
      });
      help.exchange(this, html);
      return this;
    };

    return Bill;

  })(this.Backbone.View);
  return exports.Bills = (function(_super) {
    __extends(Bills, _super);

    function Bills() {
      _ref7 = Bills.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    Bills.prototype.className = "bills";

    Bills.prototype.initialize = function() {
      this.collection = new collections.Bills;
      this.listenTo(this.collection, "sync", this.render);
      return this.collection.fetch();
    };

    Bills.prototype.render = function() {
      var html;

      html = views['member/bills']({
        bills: this.collection.toJSON(),
        view_bills: app.conf.bills
      });
      help.exchange(this, html);
      return this;
    };

    return Bills;

  })(this.Backbone.View);
}).call(this, window.views = {});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(exports) {
  var agreement_text, root, views, _ref, _ref1, _ref2;

  agreement_text = "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains. ";
  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  exports.SignIn = (function(_super) {
    __extends(SignIn, _super);

    function SignIn() {
      _ref = SignIn.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SignIn.prototype.events = {
      'click .welcome-back .thats-not-me': 'switchUser'
    };

    SignIn.prototype.switchUser = function() {
      app.session.unload();
      this.render();
      return false;
    };

    SignIn.prototype.initialize = function() {
      console.log('[_signInView__] Init');
      this.context.title = "Authentication";
      this.listenTo(app.session, "sync", this.render);
      return this.render();
    };

    SignIn.prototype.render = function() {
      this.context.user = app.session.user || null;
      this.$el.html(views['registration/login'](this.context));
      this.$el.attr('view-id', 'registration');
      return this;
    };

    return SignIn;

  })(View);
  exports.CC = (function(_super) {
    __extends(CC, _super);

    function CC() {
      _ref1 = CC.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    CC.prototype.className = "dropdown-menu";

    CC.prototype.events = {
      'click  form': "stopPropagation",
      'submit form': "updateCardData"
    };

    CC.prototype.stopPropagation = function(e) {
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
      _ref2 = Profile.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Profile.prototype.events = {
      'click a.backbone': "processAction",
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
      var $this, action, href, _ref3;

      $this = $(e.currentTarget);
      href = this.clearHref($this.attr("href"));
      _ref3 = _.without(href.split("/"), ""), action = _ref3[0], this.get = 2 <= _ref3.length ? __slice.call(_ref3, 1) : [];
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
      var billId, billView, bills, dev, merc, navigateTo, notFound, trello, _ref3;

      dev = this.clearHref(this.context.developer_agreement);
      merc = this.clearHref(this.context.merchant_agreement);
      trello = this.clearHref(this.context.trello_auth_url);
      bills = this.clearHref(this.context.bills);
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

        if (!(((_ref3 = this.get) != null ? _ref3.length : void 0) > 0)) {
          navigateTo = this.context.bills;
          this.empty(this.bills.$el);
        } else {
          navigateTo = "" + this.context.bills + "/" + (this.get.join("/"));
          billId = this.get[0];
          if (billId != null) {
            billView = new exports.Bill({
              collection: this.bills.collection,
              billId: billId
            });
            this.empty(billView.$el);
          } else {
            notFound = new exports.NotFound;
            this.empty(notFound.$el);
          }
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(exports) {
  var root, views, _ref, _ref1, _ref2, _ref3, _ref4;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  exports.DiscoverChartPopup = (function(_super) {
    __extends(DiscoverChartPopup, _super);

    function DiscoverChartPopup() {
      _ref = DiscoverChartPopup.__super__.constructor.apply(this, arguments);
      return _ref;
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
      var activity, activityStars, color, data, dot, height, lastContribution, stars, width, x, y, _ref1,
        _this = this;

      dot = $this.find(".dot");
      width = height = parseInt(dot.attr("r")) * 2;
      data = $this.attr("transform").replace(/^.+\((.+),(.+)\)$/, "$1/$2").split("/");
      _ref1 = _.map(data, function(value) {
        return parseInt(value);
      }), x = _ref1[0], y = _ref1[1];
      color = dot.css("fill");
      data = datum.source;
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
      _ref1 = DiscoverFilter.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    DiscoverFilter.prototype.events = {
      "change input[type=checkbox]": "filterResults",
      "click [data-reset]": "resetFilter",
      "click [data-clear]": "clearFilter"
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

    DiscoverFilter.prototype.clearFilter = function(e) {
      this.$(".filterBox").find("input[type=checkbox]").prop("checked", false);
      this.collection.filters = {};
      this.collection.trigger("filter");
      return false;
    };

    DiscoverFilter.prototype.resetFilter = function(e) {
      var filters;

      filters = {};
      this.$(".filterBox").find("input[type=checkbox]").prop("checked", true).each(function() {
        var languageName;

        languageName = $(this).val();
        return filters[languageName] = true;
      });
      this.collection.filters = filters;
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
      _ref2 = DiscoverComparison.__super__.constructor.apply(this, arguments);
      return _ref2;
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
      _ref3 = DiscoverChart.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    DiscoverChart.prototype.initialize = function() {
      this.listenTo(this.collection, "filter", this.renderChart);
      this.margin = {
        top: 55,
        right: 19.5,
        bottom: 60,
        left: 50
      };
      this.padding = 30;
      this.maxRadius = 50;
      this.width = this.$el.width() - this.margin.right - this.margin.left;
      this.height = this.width * 9 / 16;
      this.xScale = d3.scale.linear().domain([0, 5.25]).range([0, this.width]);
      this.yScale = d3.scale.linear().domain([0, 1]).range([this.height, 0]);
      this.colorScale = d3.scale.category20c();
      _.bindAll(this, "renderChart", "order", "formatterX");
      this.popupView = new exports.DiscoverChartPopup({
        margin: this.margin,
        scope: this.$el
      });
      return this.render();
    };

    DiscoverChart.prototype.setRadiusScale = function() {
      return this.radiusScale = d3.scale.sqrt().domain([10, this.collection.maxRadius()]).range([5, this.maxRadius]);
    };

    DiscoverChart.prototype.xTicks = [0.75, 1.75, 3, 4.5];

    DiscoverChart.prototype.formatterX = function(d, i) {
      /*
      We interpolate data in the buckets, so that
        0.25 to 1 is the 1st bucket,
        1 to 1.75 is the second,
        1.75 to 3 is the 3rd,
        3 to 5 is the last one
      */
      switch (d) {
        case this.xTicks[0]:
          return "1 week ago";
        case this.xTicks[1]:
          return "1 month ago";
        case this.xTicks[2]:
          return "6 months ago";
        case this.xTicks[3]:
          return "1+ year ago";
      }
    };

    DiscoverChart.prototype.order = function(a, b) {
      return b.radius - a.radius;
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

    DiscoverChart.prototype.collide = function(node) {
      var nx1, nx2, ny1, ny2, r;

      r = node.radius + 16;
      nx1 = node.x - r;
      nx2 = node.x + r;
      ny1 = node.y - r;
      ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        var l, x, y;

        if (quad.point && quad.point.x !== node.x && quad.point.y !== node.y) {
          x = node.x - quad.point.x;
          y = node.y - quad.point.y;
          l = Math.sqrt(x * x + y * y);
          r = node.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    };

    DiscoverChart.prototype.renderChart = function() {
      var data, g, languages, preventCollision, self,
        _this = this;

      this.setRadiusScale();
      languages = _.keys(this.collection.filters);
      if (languages.length > 0) {
        data = this.collection.filter(function(module) {
          return $.inArray(module.get("_source").language, languages) !== -1;
        });
      } else {
        data = [];
      }
      data = data.map(function(doc) {
        return {
          x: _this.xScale(doc.x()),
          y: _this.yScale(doc.y(_this.collection.maxScore)),
          radius: _this.radiusScale(doc.radius()),
          color: doc.color(),
          name: doc.name(),
          source: doc.get("_source"),
          key: doc.key()
        };
      });
      /*
        Collision changes
      */

      preventCollision = function(times) {
        var i, n, q;

        q = d3.geom.quadtree(data);
        i = 0;
        n = data.length;
        while (++i < n) {
          q.visit(_this.collide(data[i]));
        }
        if (--times > 0) {
          return preventCollision(times);
        }
      };
      preventCollision(2);
      this.dot = this.dots.selectAll(".node").data(data, function(d) {
        return d.key;
      });
      g = this.dot.enter().append("g").attr("class", "node").on("mouseover", this.popup('show', this.$el)).on("mouseout", this.popup('hide')).on("click", this.addToComparison);
      this.dot.transition().attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      g.append("circle").attr("class", "dot").style("fill", function(d) {
        return d.color;
      }).transition().attr("r", function(d) {
        return d.radius;
      });
      g.append("text").attr("text-anchor", "middle").attr("dy", ".3em").style("font-size", "2px");
      this.dot.sort(this.order);
      self = this;
      this.dot.filter(function(d, i) {
        return d.radius > 25;
      }).selectAll("text").text(function(d) {
        return d.name;
      }).transition().style("font-size", function(d) {
        var currentWidth, width;

        width = 2 * d.radius - 8;
        currentWidth = this.getComputedTextLength();
        return width / currentWidth * 2 + "px";
      });
      return this.dot.exit().transition().style("opacity", 0).remove();
    };

    DiscoverChart.prototype.render = function() {
      var _this = this;

      this.xAxis = d3.svg.axis().orient("bottom").scale(this.xScale).tickValues(this.xTicks).tickFormat(this.formatterX);
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
      _ref4 = Discover.__super__.constructor.apply(this, arguments);
      return _ref4;
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

      this.chartData = new collections.Discovery;
      this.comparisonData = new collections.DiscoveryComparison;
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
        this.fetchSearchData(qs.q);
      }
      return this.listenTo(this.chartData, "reset", this.populateComparison);
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

    Discover.prototype.populateComparison = function() {
      return this.comparisonData.reset(this.chartData.getBestMatch());
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(exports) {
  var root, views, _ref;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  return exports.HowTo = (function(_super) {
    __extends(HowTo, _super);

    function HowTo() {
      _ref = HowTo.__super__.constructor.apply(this, arguments);
      return _ref;
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

(function(exports) {
  var modules_url, qs, root, views, _ref, _ref1, _ref2, _ref3, _ref4;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  qs = root.help.qs;
  modules_url = "/modules";
  exports.Series = (function(_super) {
    __extends(Series, _super);

    function Series() {
      _ref = Series.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Series.prototype.initialize = function(opts) {
      var className,
        _this = this;

      if (opts == null) {
        opts = {};
      }
      _.bindAll(this);
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
        var _ref1;

        return _ref1 = item.get("type"), __indexOf.call(_this.types, _ref1) >= 0;
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
      _ref1 = MultiSeries.__super__.constructor.apply(this, arguments);
      return _ref1;
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
      _ref2 = Repo.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Repo.prototype.events = {};

    Repo.prototype.initialize = function(opts) {
      var e, preloadedData, repo, _ref3;

      if (opts == null) {
        opts = {};
      }
      this.language = opts.language, repo = opts.repo;
      try {
        _ref3 = decodeURI(repo).split("|"), this.owner = _ref3[0], this.repo = _ref3[1];
        if (!this.owner || !this.repo) {
          throw "Incorrect link";
        }
      } catch (_error) {
        e = _error;
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
      _ref3 = ModuleList.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    ModuleList.prototype.events = {
      'click .pagination a': "changePage"
    };

    ModuleList.prototype.initialize = function(opts) {
      var data, limit, page, preloadedData, _ref4;

      console.log('[__ModuleListView__] Init');
      this.language = opts.language;
      this.context = {
        modules_url: modules_url,
        language: this.language.capitalize()
      };
      _ref4 = qs.parse(window.location.search), page = _ref4.page, limit = _ref4.limit;
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
      var currentPage, html, i, totalPages, _i, _ref4;

      this.context.modules = this.collection.toJSON();
      _ref4 = this.collection.info(), totalPages = _ref4.totalPages, currentPage = _ref4.currentPage;
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
      _ref4 = Languages.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    Languages.prototype.events = {
      'click .pagination a': "changePage"
    };

    Languages.prototype.initialize = function() {
      var data, limit, page, preloadedData, _ref5;

      console.log('[__ModuleViewInit__] Init');
      /*
        Context
      */

      this.context.modules_url = modules_url;
      /*
        QS limits
      */

      _ref5 = qs.parse(window.location.search), page = _ref5.page, limit = _ref5.limit;
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
      var currentPage, html, i, totalPages, _i, _ref5;

      this.context.languages = this.collection.toJSON();
      _ref5 = this.collection.info(), totalPages = _ref5.totalPages, currentPage = _ref5.currentPage;
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(exports) {
  var InlineForm, Search, Task, TypeAhead, project, projectId, projects, root, task, taskEl, taskId, tasks, views, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  projects = new collections.Projects;
  tasks = new collections.Tasks;
  projectId = "";
  project = null;
  taskId = "";
  task = null;
  taskEl = null;
  TypeAhead = (function(_super) {
    __extends(TypeAhead, _super);

    function TypeAhead() {
      _ref = TypeAhead.__super__.constructor.apply(this, arguments);
      return _ref;
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
      this.suggestions = new collections.Users;
      this.cursor = {};
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
      var newValue, oldValue, value;

      value = $(event.target).attr("rel");
      oldValue = $(this.context.listener).val();
      newValue = oldValue.substring(0, this.cursor.start + 1) + value + oldValue.substring(this.cursor.end + 1);
      $(this.context.listener).val(newValue);
      return this.hide();
    };

    TypeAhead.prototype.showUser = function(cursor) {
      this.base = "/session/list";
      this.suggestions.url = "/session/list";
      this.available = true;
      return this.cursor.start = cursor;
    };

    TypeAhead.prototype.showProject = function(cursor) {
      this.base = "/project/suggest";
      this.suggestions.url = "/project/suggest";
      this.available = true;
      return this.cursor.start = cursor;
    };

    TypeAhead.prototype.showTask = function(part) {};

    TypeAhead.prototype.updateQuery = function(part, cursor) {
      if (part.length > 2) {
        this.suggestions.url = "" + this.base + "/" + part;
        console.log(this.suggestions.url);
        this.suggestions.fetch();
        return this.cursor.end = cursor;
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
      return this;
    };

    return TypeAhead;

  })(this.Backbone.View);
  InlineForm = (function(_super) {
    __extends(InlineForm, _super);

    function InlineForm() {
      _ref1 = InlineForm.__super__.constructor.apply(this, arguments);
      return _ref1;
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
      this.buf = "";
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
          return this.tah.showUser(event.target.selectionStart);
        case '#':
          this.buf = '';
          return this.tah.showTask(event.target.selectionStart);
        case '+':
          this.buf = '';
          return this.tah.showProject(event.target.selectionStart);
        case ' ':
          this.buf = '';
          this.tah.hide();
          return true;
        default:
          if (code === 8) {
            this.buf = this.buf.substring(0, this.buf.length - 1);
            return true;
          }
          if (event.charCode === 0) {
            return true;
          }
          if (this.tah.available) {
            this.buf += char;
          }
          if (this.buf.length > 0) {
            return this.tah.updateQuery(this.buf, event.target.selectionEnd);
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
      _ref2 = CreateProjectForm.__super__.constructor.apply(this, arguments);
      return _ref2;
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
      _ref3 = EditProjectForm.__super__.constructor.apply(this, arguments);
      return _ref3;
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
      _ref4 = CreateTaskForm.__super__.constructor.apply(this, arguments);
      return _ref4;
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
      _ref5 = CreateTaskCommentForm.__super__.constructor.apply(this, arguments);
      return _ref5;
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
      _ref6 = Task.__super__.constructor.apply(this, arguments);
      return _ref6;
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
      _ref7 = Search.__super__.constructor.apply(this, arguments);
      return _ref7;
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
      if (!data.search) {
        data.search = "-";
      }
      if (!data.from) {
        data.from = "none";
      } else {
        data.from = moment(data.from).unix();
      }
      if (!data.to) {
        data.to = "none";
      } else {
        data.to = moment(data.to).unix();
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
      _ref8 = Dashboard.__super__.constructor.apply(this, arguments);
      return _ref8;
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
      var _i, _j, _k, _len, _len1, _len2, _ref10, _ref11, _ref9, _results;

      this.context.canRead = false;
      this.context.canWrite = false;
      this.context.canGrant = false;
      this.context.isOwner = false;
      if (user._id === project.client.id) {
        this.context.isOwner = true;
      }
      _ref9 = project.read;
      for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
        user = _ref9[_i];
        if (user.id === this.context.user._id) {
          this.context.canRead = true;
          break;
        }
      }
      _ref10 = project.write;
      for (_j = 0, _len1 = _ref10.length; _j < _len1; _j++) {
        user = _ref10[_j];
        if (user.id === this.context.user._id) {
          this.context.canWrite = true;
          break;
        }
      }
      _ref11 = project.grant;
      _results = [];
      for (_k = 0, _len2 = _ref11.length; _k < _len2; _k++) {
        user = _ref11[_k];
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
      return this.taskView = new Task(_.extend(this.context, {
        el: "#main-area"
      }));
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
        var _i, _len, _ref9, _user;

        if (user._id === project.client.id) {
          return true;
        }
        _ref9 = project.write;
        for (_i = 0, _len = _ref9.length; _i < _len; _i++) {
          _user = _ref9[_i];
          if (_user.id === user._id) {
            return true;
          }
        }
        return false;
      };
      this.listenTo(projects, "sync", this.updateProjectList, this);
      this.listenTo(tasks, "sync", this.updateTaskList, this);
      projectId = params.project;
      taskId = params.task;
      return projects.fetch();
    };

    Dashboard.prototype.updateProjectList = function(collection) {
      this.context.projects = collection.toJSON();
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
      this.context.tasks = collection.toJSON();
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(exports) {
  var root, views, _ref, _ref1, _ref2;

  root = this;
  views = this.hbt = _.extend({}, dt, Handlebars.partials);
  exports.AdminBoard = (function(_super) {
    __extends(AdminBoard, _super);

    function AdminBoard() {
      _ref = AdminBoard.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AdminBoard.prototype.events = {
      'click a.backbone': "route"
    };

    AdminBoard.prototype.route = function(e) {
      /*
        Action routing
      */

      var href, segments;

      try {
        href = $(e.currentTarget).attr("href");
        app.navigate(href, {
          trigger: false
        });
        segments = href.split("/");
        this.action(segments[2], segments.slice(3));
      } catch (_error) {}
      return false;
    };

    AdminBoard.prototype.empty = function() {
      var opts;

      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.informationBox.children().detach();
      if (opts != null) {
        return this.informationBox.append(opts);
      }
    };

    AdminBoard.prototype.action = function(action, get) {
      var bill, billId, billView, e, model, username;

      switch (action) {
        case "users_with_stripe":
          this.empty(this.stripeUsers.$el);
          break;
        case "issue_bill":
          username = get[0];
          model = this.stripeUsers.collection.get(username);
          this.issueBill = new exports.IssueBill({
            model: model,
            collection: this.stripeUsers.collection,
            username: username
          });
          this.empty(this.issueBill.$el);
          break;
        case "bills":
          billId = get[0];
          try {
            bill = this.issuedBills.get(billId);
            if (!bill) {
              throw "no bill";
            }
          } catch (_error) {
            e = _error;
            bill = new models.Bill({
              _id: billId
            });
            bill.fetch();
          } finally {
            billView = new exports.Bill({
              model: bill
            });
            this.empty(billView.$el);
          }
      }
      return this.delegateEvents();
    };

    AdminBoard.prototype.initialize = function() {
      console.log("[__Admin View__] init");
      this.model = app.session;
      this.listenTo(this.model, "sync", this.render);
      this.stripeUsers = new exports.UsersWithStripe;
      return this.render();
    };

    AdminBoard.prototype.render = function() {
      var html;

      this.context.user = this.model.toJSON();
      html = views['admin/admin'](this.context);
      this.$el.html(html);
      this.informationBox = this.$(".informationBox");
      this.action.call(this, this.options.action, this.options.get);
      return this;
    };

    return AdminBoard;

  })(View);
  exports.IssueBill = (function(_super) {
    __extends(IssueBill, _super);

    function IssueBill() {
      _ref1 = IssueBill.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    IssueBill.prototype.events = {
      "submit form": "onSubmit"
    };

    IssueBill.prototype.onSubmit = function(e) {
      var data;

      e.preventDefault();
      data = Backbone.Syphon.serialize(e.currentTarget);
      this.bill.set(data);
      this.bill.save(null, {
        success: this.billIssued,
        error: this.billError
      });
      this.$("[type=submit]").addClass("disabled").text("Processing...");
      return false;
    };

    IssueBill.prototype.billIssued = function(model, response, options) {
      this.$("[type=submit]").removeClass("disabled").text("Issue Bill");
      this.bill.set(response.bill);
      this.issuedBills.add(this.bill);
      return this.prepareForm();
    };

    IssueBill.prototype.billError = function(model, xhr, options) {
      return console.log("Error", xhr);
    };

    IssueBill.prototype.validationErrors = function(model, errors) {
      var stringError,
        _this = this;

      stringError = [];
      _.each(errors, function(error) {
        var $input;

        if (typeof error === 'object') {
          $input = _this.$("[name='bill[" + error.name + "]']");
          $input.closest(".control-group").addClass("error");
          $input.nextAll().remove();
          return $input.after($("<span class='help-inline' />").text(error.msg));
        } else {
          return stringError.push(error);
        }
      });
      return this.globalError.text(stringError.join("; "));
    };

    IssueBill.prototype.clearErrors = function() {
      this.globalError.empty();
      return this.$(".control-group.error").removeClass("error").find(".help-inline").remove();
    };

    IssueBill.prototype.prepareForm = function() {
      var form;

      if (this.bill != null) {
        this.stopListening(this.bill);
      }
      this.bill = new models.Bill({
        bill: {
          user: this.model.get("_id")
        }
      });
      this.listenTo(this.bill, "invalid", this.validationErrors);
      this.listenTo(this.bill, "change", this.clearErrors);
      form = this.$("form");
      if (form.length > 0) {
        Backbone.Syphon.deserialize(form[0], this.bill.toJSON());
        return $("#billAmount", form).focus();
      }
    };

    IssueBill.prototype.initialize = function() {
      var _this = this;

      console.log("[__IssueBill View__] init");
      this.context = {
        bills_action: app.conf.bills,
        bills: []
      };
      _.bindAll(this, "billIssued");
      if (this.model != null) {
        return this.listIssuedBills();
      }
      return this.collection.once("sync", function() {
        _this.model = _this.collection.get(_this.options.username);
        return _this.listIssuedBills();
      });
    };

    IssueBill.prototype.listIssuedBills = function() {
      /*
        List bills for the specified user
      */
      this.issuedBills = new collections.Bills([], {
        user: this.model
      });
      this.issuedBills.fetch();
      this.listenTo(this.issuedBills, "sync", this.renderBills);
      this.listenTo(this.issuedBills, "add", this.renderBills);
      this.prepareForm();
      return this.render();
    };

    IssueBill.prototype.renderBills = function() {
      var html;

      html = views['bills/table']({
        bills: this.issuedBills.toJSON(),
        view_bills: "/admin/bills"
      });
      return this.$(".bills").html(html);
    };

    IssueBill.prototype.render = function() {
      var html;

      if (this.model != null) {
        this.context.user = this.model.toJSON();
      }
      html = views['admin/bill'](this.context);
      this.$el.html(html);
      this.globalError = this.$("legend .error");
      return this;
    };

    return IssueBill;

  })(this.Backbone.View);
  return exports.UsersWithStripe = (function(_super) {
    __extends(UsersWithStripe, _super);

    function UsersWithStripe() {
      _ref2 = UsersWithStripe.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    UsersWithStripe.prototype.initialize = function() {
      this.collection = new collections.UsersWithStripe;
      this.context = {};
      return this.listenTo(this.collection, "sync", this.render);
    };

    UsersWithStripe.prototype.render = function() {
      var html;

      this.context.users = this.collection.toJSON();
      html = views['admin/users_with_stripe'](this.context);
      this.$el.html(html);
      return this;
    };

    return UsersWithStripe;

  })(this.Backbone.View);
}).call(this, window.views);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(exports) {
  /*
    Configuring plugins
  */

  var App, conf, _ref;

  $.cookie.json = true;
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
    bills: "/profile/bills",
    users_with_stripe: "admin/users_with_stripe"
  };
  App = (function(_super) {
    __extends(App, _super);

    function App() {
      _ref = App.__super__.constructor.apply(this, arguments);
      return _ref;
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

    App.prototype.admin = function() {
      var action, get, opts;

      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.reRoute();
      if (!app.session.isSuperUser()) {
        return app.navigate("/", {
          trigger: true
        });
      }
      if (opts != null) {
        action = opts[0];
      }
      if ((opts != null ? opts.length : void 0) > 1) {
        get = opts.slice(1);
      }
      return this.view = new views.AdminBoard({
        prevView: this.view,
        action: action,
        get: get
      });
    };

    return App;

  })(Backbone.Router);
  return $(document).ready(function() {
    var app, route_keys, route_paths,
      _this = this;

    route_keys = ["", "!/", "" + conf.discover_url + "(?:params)", "!/" + conf.discover_url + "(?:params)", conf.signin_url, "!/" + conf.signin_url, conf.profile_url, "!/" + conf.profile_url, "" + conf.profile_url + "/:action", "" + conf.profile_url + "/:action/:profile", "!/" + conf.profile_url + "/:action", "!/" + conf.profile_url + "/:action/:profile", conf.how_to_url, "!/" + conf.how_to_url, conf.modules_url, "!/" + conf.modules_url, "" + conf.modules_url + "/:language", "!/" + conf.modules_url + "/:language", "" + conf.modules_url + "/:language/:repo", "!/" + conf.modules_url + "/:language/:repo", conf.dashboard_url, "!/" + conf.dashboard_url, "dashboard/project/:id", "!/dashboard/project/:id", "dashboard/project/:project/task/:task", "!/dashboard/project/:project/task/:task", conf.admin_url, "!/" + conf.admin_url, "" + conf.admin_url + "/:action(/:subaction)", "!/" + conf.admin_url + "/:action(/:subaction)"];
    route_paths = ["index", "index", "discover", "discover", "login", "login", "profile", "profile", "profile", "profile", "profile", "profile", "how-to", "how-to", "language_list", "language_list", "repo_list", "repo_list", "repo", "repo", "dashboard", "dashboard", "project", "project", "task", "task", "admin", "admin", "admin", "admin"];
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
