
(function(exports, isServer) {
  var root;
  if (isServer) {
    this.Backbone = require('backbone');
  }
  root = this;
  root.models = {};
  root.collections = {};
  root.views = {};
  root.tpl = root.hbt = _.extend({}, dt);
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

models.User = (function(_super) {

  __extends(User, _super);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.idAttribute = "github_username";

  User.prototype.urlRoot = "/session/profile";

  return User;

})(Backbone.Model);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

models.Session = (function(_super) {

  __extends(Session, _super);

  function Session() {
    return Session.__super__.constructor.apply(this, arguments);
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
    return new Date(this.get("timestamp") * 1000);
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


models.Menu = Backbone.Model.extend({});


models.Connection = Backbone.Model.extend({
  idAttribute: "_id",
  url: '/api/connection'
});


models.Runway = Backbone.Model.extend({
  idAttribute: "_id",
  url: '/api/runway'
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

collections.requestPager = (function(_super) {

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
      values: this[name]
    };
  },
  parse: function(r) {
    var ans, answered, answeredKey, answeredQs, ask, asked, askedKey, askedQs, currentDate, items, normalizeSeries, questions, _ref,
      _this = this;
    this.statistics = r.statistics, questions = r.questions;
    /*
      Add normalization
    */

    items = [];
    asked = questions.asked, answered = questions.answered;
    ask = this.statistics.total;
    ans = this.statistics.answered;
    _ref = this.statistics.keys, askedKey = _ref[0], answeredKey = _ref[1];
    this[askedKey] = askedQs = _.map(asked, function(question) {
      question.amount = ++ask;
      question.key = askedKey;
      return new _this.model(question);
    });
    this[answeredKey] = answeredQs = _.map(answered, function(question) {
      question.amount = ++ans;
      question.key = answeredKey;
      question._id += "_answered";
      return new _this.model(question);
    });
    currentDate = new Date().getTime() / 1000;
    normalizeSeries = function(series, startDate) {
      var data, first, last, questionStart, questionStop;
      if (series.length === 0) {
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setDate(1);
        startDate = startDate.getTime() / 1000;
        data = {
          amount: ask,
          key: askedKey
        };
        questionStart = new _this.model(_.extend({}, data, {
          timestamp: startDate,
          _id: "start"
        }));
        questionStop = new _this.model(_.extend({}, data, {
          timestamp: currentDate,
          _id: "stop"
        }));
      } else {
        first = _.first(series);
        last = _.last(series);
        questionStart = first.clone();
        questionStart.set({
          _id: "" + (questionStart.get('_id')) + "_start",
          timestamp: startDate
        });
        questionStop = last.clone();
        questionStop.set({
          _id: "" + (questionStop.get('_id')) + "_stop",
          timestamp: currentDate
        });
      }
      series.unshift(questionStart);
      series.push(questionStop);
      return series;
    };
    _.each([askedQs, answeredQs], function(qSeries) {
      var args;
      args = [qSeries];
      if (qSeries.length > 0) {
        args.push(_.first(qSeries).get("timestamp"));
      }
      return normalizeSeries.apply(_this, args);
    });
    return askedQs.concat(answeredQs);
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
    return "/modules/" + (encodeURIComponent(this.language)) + "/" + this.owner + "|" + this.repo + "/stackoverflow/json";
  }
});


collections.Users = Backbone.Collection.extend({
  model: models.User,
  url: "/session/list"
});


collections.Menu = Backbone.Collection.extend({
  model: models.Menu
});


collections.Connections = Backbone.Collection.extend({
  model: models.Connection,
  url: "/api/connection"
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
    return "/modules/" + (encodeURIComponent(this.language));
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
    return "/modules/" + (encodeURIComponent(this.language)) + "/" + this.owner + "|" + this.repo + "/github_events/json";
  }
});


views.NotFound = Backbone.View.extend({
  className: "error-404",
  render: function() {
    this.$el.html("Error 404 - not found");
    return this;
  }
});

var InlineForm,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

InlineForm = (function(_super) {

  __extends(InlineForm, _super);

  InlineForm.prototype.events = {
    'submit form': "submit",
    'click button[type=submit]': "preventPropagation",
    'click .close-inline': "hide",
    'keypress textarea.typeahead': "typeahead"
  };

  InlineForm.prototype.preventPropagation = function(event) {
    return event.stopPropagation();
  };

  function InlineForm(opts) {
    var $el;
    if (opts == null) {
      opts = {};
    }
    if (this.el && ($el = $(this.el)).length > 0) {
      opts.el = $el;
    }
    InlineForm.__super__.constructor.call(this, opts);
  }

  InlineForm.prototype.initialize = function(context) {
    if (context == null) {
      context = {};
    }
    this.context = _.extend({}, context, app.conf);
    _.extend(this, Backbone.Events);
    this.tah = new views.TypeAhead(this.context);
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

  InlineForm.prototype.submit = function(event, data) {
    if (data == null) {
      data = null;
    }
    event.preventDefault();
    event.stopPropagation();
    if (!data) {
      data = Backbone.Syphon.serialize(event.currentTarget);
    }
    this.$("[type=submit]").addClass("disabled").text("Updating information...");
    this.model.save(data, {
      success: _.bind(this.success, this),
      error: _.bind(this.success, this)
    });
    return false;
  };

  InlineForm.prototype.success = function(model, response, options) {
    if (response.success === true) {
      this.hide();
      this.trigger("success");
      return true;
    } else {
      console.log(response);
      alert("An error occured");
      this.trigger("fail");
      return false;
    }
  };

  InlineForm.prototype.show = function() {
    this.$el.show();
    return this.$("form input:first-child").focus();
  };

  InlineForm.prototype.hide = function(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    return this.$el.hide();
  };

  InlineForm.prototype.render = function() {
    this.$el.hide().html(tpl[this.view](this.context));
    return this;
  };

  return InlineForm;

})(Backbone.View);


views.MetaView = Backbone.View.extend({
  events: {
    'submit .navbar-search': 'searchSubmit'
  },
  searchSubmit: function(e) {
    var location, pathname, q, trigger;
    e.preventDefault();
    q = encodeURIComponent(this.$("[name=q]").val());
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
  },
  initialize: function() {
    console.log('[__metaView__] Init');
    this.Languages = new collections.Language;
    this.projects = new collections.Projects;
    this.tasks = new collections.Tasks;
    return this.menu = new views.Menu({
      el: this.$(".navigationMenu")
    });
  }
});


views.DateRangeObject = {
  ranges: {
    'All time': ['tomorrow', 'today'],
    'This week': ['monday', 'today'],
    'Last week': [Date.parse('monday').addWeeks(-1), Date.parse('monday').addDays(-1)],
    'Last month': [Date.parse('last month').addDays(-Date.parse('last month').getDate() + 1), Date.parse('today').addDays(-Date.parse('today').getDate())]
  }
};

views.DateRangeFunction = function(start, end) {
  if (start > end) {
    $('.daterange .value').html("All time");
    $('.daterange .from').html("none");
    return $('.daterange .to').html("none");
  } else {
    $('.daterange .value').html(start.toString('MMMM d, yyyy') + ' - ' + end.toString('MMMM d, yyyy'));
    $('.daterange .from').html(start.toString('yyyy-MM-dd'));
    return $('.daterange .to').html(end.toString('yyyy-MM-dd'));
  }
};


views.Loader = Backbone.View.extend({
  tagName: 'img',
  attributes: {
    src: "/static/images/loader.gif"
  }
});


views.Agreement = Backbone.View.extend({
  tagName: 'div',
  className: 'row-fluid agreementContainer',
  events: {
    'submit form': 'processSubmit'
  },
  show: function() {
    return this.$el.show();
  },
  hide: function() {
    return this.$el.hide();
  },
  processSubmit: function(e) {
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
  },
  signed: function() {
    return app.navigate(app.conf.profile_url, {
      trigger: true
    });
  },
  initialize: function() {
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
  },
  renderData: function() {
    var output;
    output = tpl['member/agreement'](this.context);
    this.$el.html($(output).unwrap().html());
    return this.trigger("init");
  },
  setData: function(agreement, action) {
    this.context = {
      agreement_text: agreement,
      agreement_signup_action: action
    };
    this.model.url = this.context.agreement_signup_action;
    return this.renderData();
  },
  niceScroll: function() {
    if (this.$(".agreementText").is(":visible")) {
      this.$(".agreementText").niceScroll();
    }
    return this.delegateEvents();
  },
  render: function() {
    var html;
    html = tpl['member/agreement'](this.context || {});
    this.$el = $(html);
    this.delegateEvents();
    return this;
  }
});

var View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = (function(_super) {

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


views.Index = View.extend({
  initialize: function() {
    console.log('[__indexView__] Init');
    this.context.title = "Home Page";
    return this.render();
  },
  render: function() {
    var html;
    html = tpl['index'](this.context, null, this.context.partials);
    this.$el.html(html);
    this.$el.attr('view-id', 'index');
    return this;
  }
});


views.ShareIdeas = Backbone.View.extend({
  events: {
    'click .share-ideas': 'toggleShow',
    'click .close': 'toggleShow',
    'click .submit': 'submit'
  },
  initialize: function() {
    return console.log('[__ShareIdeasView__] Init');
  },
  toggleShow: function() {
    return $('.share-common').toggleClass('show');
  },
  submit: function() {
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
  }
});


views.Bill = Backbone.View.extend({
  className: "bill",
  initialize: function() {
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
  },
  render: function() {
    var html;
    html = tpl['member/bill']({
      bill: this.model.toJSON(),
      user: app.session.toJSON()
    });
    help.exchange(this, html);
    return this;
  }
});


views.Bills = Backbone.View.extend({
  className: "bills",
  initialize: function() {
    this.collection = new collections.Bills;
    this.listenTo(this.collection, "sync", this.render);
    return this.collection.fetch();
  },
  render: function() {
    var html;
    html = tpl['member/bills']({
      bills: this.collection.toJSON(),
      view_bills: app.conf.bills
    });
    help.exchange(this, html);
    return this;
  }
});


views.Menu = Backbone.View.extend({
  className: "navigationMenu nav pull-right",
  initialize: function() {
    var data;
    console.log("[__Menu View__] initialized");
    data = $("[data-menu]").data("menu");
    this.collection = new collections.Menu(data);
    return this.listenTo(app, "route", this.navigate);
  },
  navigate: function() {
    var parse, pathname,
      _this = this;
    parse = help.qs.parse;
    pathname = window.location.pathname;
    if (pathname.length > 1) {
      this.collection.forEach(function(link) {
        var isActive, testUrl;
        testUrl = new RegExp("^" + (link.get('url')) + ".*$");
        isActive = testUrl.test(pathname);
        return link.set({
          isActive: isActive
        });
      });
    } else {
      this.collection.forEach(function(link) {
        return link.set({
          isActive: false
        });
      });
    }
    return this.render();
  },
  render: function() {
    var context, view;
    context = {
      _menu: this.collection.toJSON()
    };
    view = tpl['menu'](context);
    this.$el.html(view);
    return this;
  }
});


views.SignIn = View.extend({
  events: {
    'click .welcome-back .thats-not-me': 'switchUser'
  },
  switchUser: function() {
    app.session.unload();
    this.render();
    return false;
  },
  initialize: function() {
    console.log('[_signInView__] Init');
    this.context.title = "Authentication";
    this.listenTo(app.session, "sync", this.render);
    return this.render();
  },
  render: function() {
    this.context.user = app.session.user || null;
    this.$el.html(tpl['registration/login'](this.context));
    this.$el.attr('view-id', 'registration');
    return this;
  }
});


views.CC = Backbone.View.extend({
  className: "dropdown-menu",
  events: {
    'click  form': "stopPropagation",
    'submit form': "updateCardData"
  },
  stopPropagation: function(e) {
    return e.stopPropagation();
  },
  updateCardData: function(e) {
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
  },
  processUpdate: function(model, response, options) {
    if (response.success === true) {
      return app.session.set({
        has_stripe: true
      });
    } else {

    }
  },
  initialize: function() {
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
  },
  render: function() {
    var html;
    html = tpl['member/credit_card'](this.context);
    this.$el.html($(html).html());
    return this;
  }
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.WriterRunways = (function(_super) {

  __extends(WriterRunways, _super);

  function WriterRunways() {
    return WriterRunways.__super__.constructor.apply(this, arguments);
  }

  WriterRunways.prototype.initialize = function(context) {
    this.context = context;
    WriterRunways.__super__.initialize.call(this, this.context);
    this.runways_writer = new collections.Connections;
    this.runways_writer.url = "/api/runway/writer";
    this.listenTo(this.runways_writer, "sync", this.render);
    return this.runways_writer.fetch();
  };

  WriterRunways.prototype.render = function() {
    var html;
    this.context.runways_writer = this.runways_writer.toJSON();
    html = tpl['member/writer_runway'](this.context);
    this.$el.html(html);
    return this;
  };

  return WriterRunways;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.WriterFinance = (function(_super) {

  __extends(WriterFinance, _super);

  function WriterFinance() {
    return WriterFinance.__super__.constructor.apply(this, arguments);
  }

  WriterFinance.prototype.events = {
    'click #writer-filter': 'filterWriter',
    'click #writer-csv': 'getCSV'
  };

  WriterFinance.prototype.filterWriter = function(e) {
    var a, bb, data,
      _this = this;
    e.preventDefault();
    e.stopPropagation();
    this.context.from = this.$("#writer_from").text() || "none";
    this.context.to = this.$("#writer_to").text() || "none";
    this.context.active_tab = "writer-finance";
    this.context.writer_filter = this.$("#writer_filter").text();
    this.render();
    data = "\"Client\";\"Paid\";\"Pending\"\n";
    _.each(this.context.finance_writer, function(finance) {
      var paid, pending;
      paid = 0;
      pending = 0;
      _.each(finance.runways, function(runway) {
        var f, m, t;
        m = moment(runway.date);
        f = moment(_this.context.from);
        t = moment(_this.context.to);
        if (_this.context.from !== "none" && _this.context.to !== "none" && !((m.isAfter(f, 'day') || m.isSame(f, 'day')) && (m.isBefore(t, 'day')) || m.isSame(t, 'day'))) {
          return;
        }
        if (runway.paid) {
          return paid += runway.charged;
        } else {
          return pending += runway.charged;
        }
      });
      return data += "\"" + finance.writer.name + "\";\"" + paid + "\";\"" + pending + "\"\n";
    });
    window.URL = window.webkitURL || window.URL;
    a = document.getElementById("writer-csv");
    if (a.href) {
      window.URL.revokeObjectURL(a.href);
    }
    if (a.dataset == null) {
      a.dataset = {};
    }
    bb = new Blob([data], {
      type: "text/csv"
    });
    a.download = "Report for " + this.context.writer_filter + ".csv";
    a.href = window.URL.createObjectURL(bb);
    return a.dataset.downloadurl = ["text/csv", a.download, a.href].join(':');
  };

  WriterFinance.prototype.initialize = function(context) {
    this.context = context;
    WriterFinance.__super__.initialize.call(this, this.context);
    this.finance_writer = new models.Runway;
    this.finance_writer.url = "/api/runway/writer";
    this.listenTo(this.finance_writer, "sync", this.render);
    return this.finance_writer.fetch();
  };

  WriterFinance.prototype.render = function() {
    var html;
    this.context.finance_writer = this.finance_writer.toJSON();
    html = tpl['member/writer_finance'](this.context);
    this.$el.html(html);
    this.$('.daterange').daterangepicker(views.DateRangeObject, views.DateRangeFunction);
    return this;
  };

  return WriterFinance;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.ConnectionForm = (function(_super) {

  __extends(ConnectionForm, _super);

  function ConnectionForm() {
    return ConnectionForm.__super__.constructor.apply(this, arguments);
  }

  ConnectionForm.prototype.el = "#new-connection-inline";

  ConnectionForm.prototype.view = "member/new_connection";

  ConnectionForm.prototype.initialize = function(context) {
    var $ids, $reader, $writer;
    this.model = new models.Connection;
    ConnectionForm.__super__.initialize.call(this, context);
    $reader = this.$("input[name=reader]");
    $writer = this.$("input[name=writer]");
    $ids = {};
    $ids['reader'] = this.$("input[name=reader_id]");
    $ids['writer'] = this.$("input[name=writer_id]");
    return $reader.add($writer).typeahead({
      source: function(query, process) {
        var users,
          _this = this;
        this.map = {};
        users = [];
        if (this.xhr != null) {
          this.xhr.abort();
        }
        return this.xhr = $.getJSON("/session/list", {
          term: query
        }, function(data) {
          _.each(data, function(user) {
            _this.map[user.label] = user;
            return users.push(user.label);
          });
          return process(users);
        });
      },
      minLength: 1,
      updater: function(item) {
        $ids[$(this.$element).attr("name")].val(this.map[item].value);
        return item;
      },
      matcher: function(item) {
        if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1) {
          return true;
        }
      },
      sorter: function(items) {
        return items.sort();
      },
      highlighter: function(item) {
        var regex;
        regex = new RegExp('(' + this.query + ')', 'gi');
        return item.replace(regex, "<strong>$1</strong>");
      }
    });
  };

  return ConnectionForm;

})(InlineForm);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.TrackTimeForm = (function(_super) {

  __extends(TrackTimeForm, _super);

  function TrackTimeForm() {
    return TrackTimeForm.__super__.constructor.apply(this, arguments);
  }

  TrackTimeForm.prototype.el = "#track-time-inline";

  TrackTimeForm.prototype.view = "member/track_time";

  TrackTimeForm.prototype.initialize = function(context) {
    this.model = new models.Runway;
    this.model.url += "/" + context.suffix;
    return TrackTimeForm.__super__.initialize.call(this, context);
  };

  TrackTimeForm.prototype.submit = function(event) {
    var data;
    event.preventDefault();
    event.stopPropagation();
    data = Backbone.Syphon.serialize(event.currentTarget);
    if (parseInt(data.worked) > this.context.limit) {
      alert("Time limit exceeded!");
      return false;
    } else {
      return TrackTimeForm.__super__.submit.call(this, event);
    }
  };

  return TrackTimeForm;

})(InlineForm);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.AlterRunwayForm = (function(_super) {

  __extends(AlterRunwayForm, _super);

  function AlterRunwayForm() {
    return AlterRunwayForm.__super__.constructor.apply(this, arguments);
  }

  AlterRunwayForm.prototype.el = "#alter-runway-inline";

  AlterRunwayForm.prototype.view = "member/alter_runway";

  AlterRunwayForm.prototype.initialize = function(context) {
    this.model = context.model;
    return AlterRunwayForm.__super__.initialize.call(this, context);
  };

  AlterRunwayForm.prototype.submit = function(event) {
    var data;
    event.preventDefault();
    event.stopPropagation();
    data = Backbone.Syphon.serialize(event.currentTarget);
    if (parseInt(data.data) + this.context.current < this.context.limit) {
      alert("Runway must be higher than or equal to " + this.context.limit);
      return false;
    } else {
      data.data = parseInt(data.data) + this.context.current;
      return AlterRunwayForm.__super__.submit.call(this, event, data);
    }
  };

  return AlterRunwayForm;

})(InlineForm);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.AdminConnections = (function(_super) {

  __extends(AdminConnections, _super);

  function AdminConnections() {
    return AdminConnections.__super__.constructor.apply(this, arguments);
  }

  AdminConnections.prototype.initialize = function(context) {
    this.context = context;
    AdminConnections.__super__.initialize.call(this, this.context);
    this.connections = new collections.Connections;
    this.listenTo(this.connections, "sync", this.render);
    return this.connections.fetch();
  };

  AdminConnections.prototype.render = function() {
    var html;
    this.context.connections = this.connections.toJSON();
    html = tpl['member/admin_connections'](this.context);
    this.$el.html(html);
    return this;
  };

  return AdminConnections;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.AdminFinance = (function(_super) {

  __extends(AdminFinance, _super);

  function AdminFinance() {
    return AdminFinance.__super__.constructor.apply(this, arguments);
  }

  AdminFinance.prototype.events = {
    'click #admin-filter': 'filterAdmin'
  };

  AdminFinance.prototype.filterAdmin = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.context.admin_from = this.$("#admin_from").text() || "none";
    this.context.admin_to = this.$("#admin_to").text() || "none";
    this.context.active_tab = "admin-finance";
    this.context.admin_filter = this.$("#admin_filter").text();
    return this.render();
  };

  AdminFinance.prototype.initialize = function(context) {
    this.context = context;
    AdminFinance.__super__.initialize.call(this, this.context);
    this.connections = new collections.Connections;
    this.listenTo(this.connections, "sync", this.render);
    return this.connections.fetch();
  };

  AdminFinance.prototype.render = function() {
    var html;
    this.context.connections = this.connections.toJSON();
    html = tpl['member/admin_finance'](this.context);
    this.$el.html(html);
    this.$('.daterange').daterangepicker(views.DateRangeObject, views.DateRangeFunction);
    return this;
  };

  return AdminFinance;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.ReaderRunways = (function(_super) {

  __extends(ReaderRunways, _super);

  function ReaderRunways() {
    return ReaderRunways.__super__.constructor.apply(this, arguments);
  }

  ReaderRunways.prototype.initialize = function(context) {
    this.context = context;
    ReaderRunways.__super__.initialize.call(this, this.context);
    this.runways_reader = new collections.Connections;
    this.runways_reader.url = "/api/runway/reader";
    this.listenTo(this.runways_reader, "sync", this.render);
    return this.runways_reader.fetch();
  };

  ReaderRunways.prototype.render = function() {
    var html;
    this.context.runways_reader = this.runways_reader.toJSON();
    html = tpl['member/reader_runway'](this.context);
    this.$el.html(html);
    return this;
  };

  return ReaderRunways;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.ReaderFinance = (function(_super) {

  __extends(ReaderFinance, _super);

  function ReaderFinance() {
    return ReaderFinance.__super__.constructor.apply(this, arguments);
  }

  ReaderFinance.prototype.initialize = function(context) {
    this.context = context;
    ReaderFinance.__super__.initialize.call(this, this.context);
    this.finance_reader = new models.Runway;
    this.finance_reader.url = "/api/finance/reader";
    this.listenTo(this.finance_reader, "sync", this.render);
    return this.finance_reader.fetch();
  };

  ReaderFinance.prototype.render = function() {
    var html;
    this.context.finance_reader = this.finance_reader.toJSON();
    html = tpl['member/reader_finance'](this.context);
    this.$el.html(html);
    this.$('.daterange').daterangepicker(views.DateRangeObject, views.DateRangeFunction);
    return this;
  };

  return ReaderFinance;

})(View);

var __slice = [].slice;

views.Profile = View.extend({
  agreement_text: "Do you agree?",
  events: {
    'click a.backbone': "processAction",
    'click .setupPayment > button': "update_cc_events",
    'click #new-connection': "newConnection",
    'click #track-time': "trackTime",
    'click #alter-runway': 'alterRunway'
  },
  newConnection: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.connectionform) {
      this.stopListening(this.connectionform);
      delete this.connectionform;
    }
    this.connectionform = new views.ConnectionForm(this.context);
    this.listenTo(this.connectionform, "success", this.updateData);
    return this.connectionform.show();
  },
  trackTime: function(e) {
    var limit, suffix;
    e.preventDefault();
    e.stopPropagation();
    suffix = e.currentTarget.attributes['rel'].value;
    limit = parseInt(e.currentTarget.attributes['data-limit'].value);
    this.trackForm = new views.TrackTimeForm(_.extend(this.context, {
      suffix: suffix,
      limit: limit,
      el: "#track-time-inline-" + suffix
    }));
    this.listenTo(this.trackForm, "success", this.updateData);
    return this.trackForm.show();
  },
  alterRunway: function(e) {
    var current, limit, model, suffix;
    e.preventDefault();
    e.stopPropagation();
    suffix = e.currentTarget.attributes['rel'].value;
    limit = parseInt(e.currentTarget.attributes['data-limit'].value);
    current = parseInt(e.currentTarget.attributes['data-current'].value);
    model = this.connections.get(suffix);
    this.editForm = new views.AlterRunwayForm(_.extend(this.context, {
      limit: limit,
      model: model,
      current: current,
      el: "#alter-runway-inline-" + suffix
    }));
    this.listenTo(this.editForm, "success", this.updateData);
    return this.editForm.show();
  },
  updateData: function(e) {
    this.connections.fetch();
    this.runways_reader.fetch();
    return this.runways_writer.fetch();
  },
  update_cc_events: function(e) {
    this.cc.delegateEvents();
    return $(e.currentTarget).dropdown('toggle');
  },
  clearHref: function(href) {
    return href.replace("/" + this.context.profile_url, "");
  },
  processAction: function(e) {
    var $this, action, href, _ref;
    $this = $(e.currentTarget);
    href = this.clearHref($this.attr("href"));
    _ref = _.without(href.split("/"), ""), action = _ref[0], this.get = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    this.setAction("/" + action);
    return false;
  },
  empty: function() {
    var opts;
    opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.informationBox.children().detach();
    if (opts != null) {
      return this.informationBox.append(opts);
    }
  },
  setAction: function(action) {
    var billId, billView, bills, dev, merc, navigateTo, notFound, trello, _ref;
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
      this.empty(this.agreement.$el);
      this.agreement.show();
      return this.agreement.setData(this.agreement_text, this.context.developer_agreement);
    } else if (action === merc && app.session.get("merchant") === false) {
      /*
        show client license agreement
      */

      app.navigate(this.context.merchant_agreement, {
        trigger: false
      });
      this.empty(this.agreement.$el);
      this.agreement.show();
      this.agreement.setData(this.agreement_text, this.context.merchant_agreement);
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

      if (!(((_ref = this.get) != null ? _ref.length : void 0) > 0)) {
        navigateTo = this.context.bills;
        this.empty(this.bills.$el);
      } else {
        navigateTo = "" + this.context.bills + "/" + (this.get.join("/"));
        billId = this.get[0];
        if (billId != null) {
          billView = new views.Bill({
            collection: this.bills.collection,
            billId: billId
          });
          this.empty(billView.$el);
        } else {
          notFound = new views.NotFound;
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
  },
  initialize: function(options) {
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
      this.agreement = new views.Agreement;
      this.cc = new views.CC;
      this.bills = new views.Bills;
    }
    this.context.from = "none";
    this.context.to = "none";
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "sync", this.render);
    return this.model.fetch();
  },
  render: function() {
    var html;
    console.log("Rendering profile view");
    this.context.user = this.model.toJSON();
    html = tpl['member/profile'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'profile');
    this.informationBox = this.$(".informationBox");
    this.adminConnections = new views.AdminConnections(_.extend(this.context, {
      el: this.$("#admin-connections")
    }));
    this.adminFinance = new views.AdminFinance(_.extend(this.context, {
      el: this.$("#admin-finance")
    }));
    this.readerRunway = new views.ReaderRunways(_.extend(this.context, {
      el: this.$("#reader-runway")
    }));
    this.readerFinance = new views.ReaderFinance(_.extend(this.context, {
      el: this.$("#reader-finance")
    }));
    this.writerRunway = new views.WriterRunways(_.extend(this.context, {
      el: this.$("#writer-runway")
    }));
    this.writerFinance = new views.WriterFinance(_.extend(this.context, {
      el: this.$("#writer-finance")
    }));
    if (this.cc) {
      this.cc.setElement(this.$(".setupPayment .dropdown-menu"));
      this.cc.$el.prev().dropdown();
    }
    if (this.context["private"]) {
      this.setAction(this.options.action);
    }
    return this;
  }
});


views.DiscoverChartPopup = Backbone.View.extend({
  tagName: "div",
  className: "popover",
  initialize: function() {
    this.moduleName = $("<h4 />").addClass("moduleName");
    this.moduleLanguage = $("<h5 />").addClass("moduleLanguage").append("<span class='color' />").append("<span class='name' />");
    this.moduleDescription = $("<p />").addClass("moduleDescription");
    this.moduleStars = $("<div />").addClass("moduleStars");
    return this.render();
  },
  render: function() {
    this.$el.appendTo(this.options.scope);
    this.$el.hide().append(this.moduleName, this.moduleLanguage, this.moduleDescription, this.moduleStars);
    return this;
  },
  show: function() {
    this.$el.show();
    return this;
  },
  hide: function() {
    this.$el.hide();
    return this;
  },
  setData: function(datum, $this, scope) {
    var activity, activityStars, color, height, lastContribution, source, stars, width, x, y;
    width = height = datum.radius * 2;
    x = datum.x, y = datum.y, color = datum.color, source = datum.source;
    stars = source.watchers;
    lastContribution = humanize.relativeTime(new Date(source.pushed_at).getTime() / 1000);
    activity = $("<p class='activity' />").html("<i class='icon-star'></i>Last checking <strong>" + lastContribution + "</strong>");
    activityStars = $("<p class='stars' />").html("<i class='icon-star'></i><strong>" + stars + " stars</strong> on GitHub");
    this.moduleName.text("" + source.owner + "/" + source.module_name);
    this.moduleLanguage.find(".name").text(source.language).end().find(".color").css({
      background: color
    });
    this.moduleDescription.text(source.description);
    this.moduleStars.html("").append(activity, activityStars);
    this.show();
    return this.$el.css({
      bottom: (this.options.scope.outerHeight() - y - (this.$el.outerHeight() / 2) - 15) + 'px',
      left: x + this.options.margin.left + (width / 2) + 15 + 'px'
    });
  }
});


views.DiscoverFilter = Backbone.View.extend({
  events: {
    "change input[type=checkbox]": "filterResults",
    "click [data-reset]": "resetFilter",
    "click [data-clear]": "clearFilter"
  },
  initialize: function() {
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
  },
  clearFilter: function(e) {
    this.$(".filterBox").find("input[type=checkbox]").prop("checked", false);
    this.collection.filters = {};
    this.collection.trigger("filter");
    return false;
  },
  resetFilter: function(e) {
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
  },
  filterResults: function(e) {
    var $this, languageName;
    $this = $(e.currentTarget);
    languageName = $this.val();
    if ($this.is(":checked")) {
      this.collection.filters[languageName] = true;
    } else {
      delete this.collection.filters[languageName];
    }
    return this.collection.trigger("filter");
  },
  render: function() {
    var html;
    this.context.filters[0].languages = this.collection.languageList();
    html = tpl['discover/filter'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'discoverFilter');
    return this;
  }
});


views.DiscoverComparison = Backbone.View.extend({
  events: {
    "click [data-sort]": "sortComparison",
    "mouseenter tbody tr": "fadeIn",
    "mouseleave tbody tr": "fadeOut",
    "click tbody tr .btn-danger": "remove"
  },
  fadeIn: function(e) {
    return this.fade(true, e);
  },
  fadeOut: function(e) {
    return this.fade(false, e);
  },
  fade: function(className, e) {
    var $fade, $this, action;
    $this = $(e.currentTarget);
    $fade = $(".fade", $this);
    action = className ? "addClass" : "removeClass";
    return $fade[action]("in");
  },
  remove: function(e) {
    var $this, id, model;
    $this = $(e.currentTarget).closest("tr");
    id = $this.data("id");
    model = this.collection.get(id);
    return this.collection.remove(model);
  },
  sortComparison: function(e) {
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
  },
  initialize: function() {
    _.bindAll(this);
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
  },
  render: function() {
    var html;
    this.context.projects = this.collection.toJSON();
    html = tpl['discover/compare'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'discoverComparison');
    return this;
  }
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.DiscoverChart = (function(_super) {

  __extends(DiscoverChart, _super);

  function DiscoverChart() {
    return DiscoverChart.__super__.constructor.apply(this, arguments);
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
    _.bindAll(this, "renderChart", "order", "formatterX", "addToComparison", "resizeContent");
    $(window).on("resize", this.resizeContent);
    this.popupView = new views.DiscoverChartPopup({
      margin: this.margin,
      scope: this.$el
    });
    return this.render();
  };

  DiscoverChart.prototype.remove = function() {
    $(window).off("resize", this.resizeContent);
    return DiscoverChart.__super__.remove.apply(this, arguments);
  };

  DiscoverChart.prototype.resizeContent = function() {
    this.popupView.$el.detach();
    this.$el.empty();
    this.render();
    this.$el.append(this.popupView.$el);
    if (this.collection.models.length > 0) {
      return this.renderChart();
    }
  };

  DiscoverChart.prototype.render = function() {
    this.width = this.$el.width() - this.margin.right - this.margin.left;
    this.height = this.width * 9 / 16;
    this.xScale = d3.scale.linear().domain([0, 5.25]).range([0, this.width]);
    this.yScale = d3.scale.linear().domain([0, 1]).range([this.height, 0]);
    this.colorScale = d3.scale.category20c();
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

  /*
    Helper functions
  */


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
    return app.view.comparisonData.add(this.collection.get(document.key));
  };

  DiscoverChart.prototype.collide = function(node) {
    var nx1, nx2, ny1, ny2, r;
    r = node.radius + 4;
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

  /*
    Render chart
  */


  DiscoverChart.prototype.renderChart = function() {
    var data, languages, preventCollision,
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
    this.dot = this.dots.selectAll(".dot").data(data, function(d) {
      return d.key;
    });
    this.dot.enter().append("circle").attr("class", "dot").on("mouseover", this.popup('show', this.$el)).on("mouseout", this.popup('hide')).on("click", this.addToComparison).style("fill", function(d) {
      return d.color;
    }).transition().attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d) {
      return d.radius;
    });
    this.dot.exit().transition().attr("r", 0).remove();
    return this.dot.sort(this.order);
  };

  return DiscoverChart;

})(View);


views.Discover = View.extend({
  events: {
    'submit .search-form': 'searchSubmit'
  },
  initialize: function() {
    var qs;
    console.log('[__discoverView__] Init');
    _.bindAll(this, "fetchSearchData", "render", "searchSubmit");
    qs = help.qs.parse(location.search);
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
    this.filter = new views.DiscoverFilter({
      el: this.$(".filter"),
      collection: this.chartData
    });
    this.chart = new views.DiscoverChart({
      el: this.$("#searchChart"),
      collection: this.chartData
    });
    this.comparison = new views.DiscoverComparison({
      el: this.$("#moduleComparison"),
      collection: this.comparisonData
    });
    if (qs.q != null) {
      this.fetchSearchData(qs.q);
    }
    return this.listenTo(this.chartData, "reset", this.populateComparison);
  },
  searchSubmit: function(e) {
    var pathname, q;
    e.preventDefault();
    q = this.$("[name=q]").val();
    pathname = window.location.pathname;
    app.navigate("" + pathname + "?q=" + q, {
      trigger: false
    });
    return this.fetchSearchData(q);
  },
  fetchSearchData: function(query) {
    return this.chart.collection.fetch(query);
  },
  populateComparison: function() {
    return this.comparisonData.reset(this.chartData.getBestMatch());
  },
  render: function() {
    var html;
    html = tpl['discover/index'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'discover');
    return this;
  }
});


views.HowTo = View.extend({
  initialize: function() {
    console.log('[__HowToView__] Init');
    return this.render();
  },
  render: function() {
    var html;
    html = tpl['how-to'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'how-to');
    return this;
  }
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

views.Series = (function(_super) {

  __extends(Series, _super);

  function Series() {
    return Series.__super__.constructor.apply(this, arguments);
  }

  Series.prototype.initialize = function(opts) {
    var _this = this;
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
    this.line = d3.svg.line().x(function(d) {
      return _this.x(d.x());
    }).y(function(d) {
      return _this.y(d.y);
    });
    return $(window).on("resize", this.resizeContent);
  };

  Series.prototype.remove = function() {
    $(window).off("resize", this.resizeContent);
    return Series.__super__.remove.apply(this, arguments);
  };

  Series.prototype.resizeContent = function() {
    this.$el.empty();
    return this.render();
  };

  Series.prototype.render = function() {
    var className, data, prev,
      _this = this;
    this.width = this.$el.width() - this.margin.right - this.margin.left;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom").ticks(4);
    this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(4);
    className = this.$el.attr("class");
    this.svg = d3.select("." + className).append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
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
    this.x.nice(d3.time.day);
    this.y.domain(d3.extent(data, function(d) {
      return d.y;
    }));
    this.y.nice();
    this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")").call(this.xAxis);
    this.svg.append("g").attr("class", "y axis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(this.title);
    return this.svg.append("path").datum(data).attr("class", "line").attr("d", this.line);
  };

  return Series;

})(Backbone.View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.MultiSeries = (function(_super) {

  __extends(MultiSeries, _super);

  function MultiSeries() {
    return MultiSeries.__super__.constructor.apply(this, arguments);
  }

  MultiSeries.prototype.initialize = function(opts) {
    var _this = this;
    if (opts == null) {
      opts = {};
    }
    _.bindAll(this);
    this.margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 50
    };
    this.color = d3.scale.category10();
    this.line = d3.svg.line().x(function(d) {
      return _this.x(d.x());
    }).y(function(d) {
      return _this.y(d.y());
    });
    return $(window).on("resize", this.resizeContent);
  };

  MultiSeries.prototype.remove = function() {
    $(window).off("resize", this.resizeContent);
    return MultiSeries.__super__.remove.apply(this, arguments);
  };

  MultiSeries.prototype.resizeContent = function() {
    this.$el.empty();
    return this.render();
  };

  MultiSeries.prototype.render = function() {
    var className, max, min, question, questions,
      _this = this;
    this.width = this.$el.width() - this.margin.right - this.margin.left;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom").ticks(6);
    this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(6);
    className = this.$el.attr("class");
    this.svg = d3.select("." + className).append("svg").attr("width", this.width + this.margin.left + this.margin.right).attr("height", this.height + this.margin.top + this.margin.bottom).append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.color.domain(this.collection.keys());
    questions = this.color.domain().map(this.collection.chartMap);
    this.x.domain(d3.extent(this.collection.models, function(d) {
      return d.x();
    }));
    this.x.nice(d3.time.month);
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
    if (min === 0 && max === 0) {
      min = -1;
      max = 1;
      this.yAxis.tickValues([0]).tickFormat(d3.format("f.0"));
    } else {
      min *= 0.9;
      max *= 1.1;
    }
    this.y.domain([min, max]);
    this.y.nice();
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
    }).attr("x", 10).attr("dy", "-1em").style("text-anchor", "end").text(function(d) {
      if (d.value != null) {
        return d.name;
      } else {
        return "";
      }
    });
    return this;
  };

  return MultiSeries;

})(Backbone.View);


views.Repo = View.extend({
  events: {
    'click [data-action=star]': "setBookmark"
  },
  setBookmark: function() {
    var $this;
    return $this = $(e.currentTarget);
  },
  initialize: function(opts) {
    var preloadedData, repo, _ref;
    if (opts == null) {
      opts = {};
    }
    this.language = opts.language, repo = opts.repo;
    try {
      _ref = decodeURI(repo).split("|"), this.owner = _ref[0], this.repo = _ref[1];
    } catch (_error) {}
    this.model = new models.Repo({
      language: this.language,
      module_name: this.repo,
      owner: this.owner
    });
    /*
      context
    */

    this.context = {
      modules_url: "/" + app.conf.modules_url
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
  },
  initCharts: function() {
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
  },
  initSO: function() {
    var options, so;
    options = {
      language: this.language,
      owner: this.owner,
      repo: this.repo
    };
    this.collections.stackOverflow = so = new collections.StackOverflowQuestions(options);
    return this.charts.stackOverflow = new views.MultiSeries({
      el: this.$(".stackQAHistory"),
      collection: so
    });
  },
  initGE: function() {
    var ge, options;
    options = {
      language: this.language,
      owner: this.owner,
      repo: this.repo
    };
    this.collections.githubEvents = ge = new collections.GithubEvents(options);
    this.charts.githubCommits = new views.Series({
      el: this.$(".commitHistory"),
      collection: ge,
      types: ["PushEvent"],
      title: "Commits over time"
    });
    return this.charts.githubWatchers = new views.Series({
      el: this.$(".starsHistory"),
      collection: ge,
      types: ["WatchEvent"],
      title: "Watchers over time"
    });
  },
  render: function() {
    var html;
    this.context.module = this.model.toJSON();
    html = tpl['module/view'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'module-list');
    return this;
  }
});


views.ModuleList = View.extend({
  events: {
    'click .pagination a': "changePage"
  },
  initialize: function(opts) {
    var data, limit, page, preloadedData, _ref;
    console.log('[__ModuleListView__] Init');
    this.language = opts.language;
    this.context = {
      modules_url: modules_url,
      language: this.language.capitalize()
    };
    _ref = help.qs.parse(window.location.search), page = _ref.page, limit = _ref.limit;
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
  },
  changePage: function(e) {
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
  },
  render: function() {
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
    html = tpl['module/modules'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'module-list');
    return this;
  }
});


views.Languages = View.extend({
  events: {
    'click .pagination a': "changePage"
  },
  initialize: function() {
    var data, limit, page, preloadedData, _ref;
    console.log('[__ModuleViewInit__] Init');
    /*
      Context
    */

    this.context.modules_url = modules_url;
    /*
      QS limits
    */

    _ref = help.qs.parse(window.location.search), page = _ref.page, limit = _ref.limit;
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
  },
  changePage: function(e) {
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
  },
  render: function() {
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
    html = tpl['module/index'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'language-list');
    return this;
  }
});


views.TypeAhead = Backbone.View.extend({
  el: "#typeahead",
  events: {
    'click li.suggestion': "select"
  },
  initialize: function(context) {
    if (context == null) {
      context = {};
    }
    this.context = context;
    this.suggestions = new collections.Users;
    this.cursor = {};
    return this.listenTo(this.suggestions, "reset", this.render);
  },
  position: function(element) {
    var height, offset, width;
    offset = $(element).offset();
    width = $(element).width();
    height = $(element).height();
    this.$el.css('left', offset.left);
    this.$el.css('top', offset.top + height);
    if (!this.context.listener) {
      return this.context.listener = $(element);
    }
  },
  select: function(e) {
    var newValue, oldValue, value;
    value = $(e.currentTarget).attr("rel");
    oldValue = this.context.listener.val();
    newValue = oldValue.substring(0, this.cursor.start + 1) + value + oldValue.substring(this.cursor.end + 1);
    this.context.listener.val(newValue);
    return this.hide();
  },
  showUser: function(cursor) {
    this.base = "/session/list";
    this.suggestions.url = "/session/list";
    this.available = true;
    return this.cursor.start = cursor;
  },
  showProject: function(cursor) {
    this.base = "/project/suggest";
    this.suggestions.url = "/project/suggest";
    this.available = true;
    return this.cursor.start = cursor;
  },
  showTask: function(part) {},
  updateQuery: function(part, cursor) {
    if (part.length > 2) {
      this.suggestions.url = "" + this.base + "/" + part;
      console.log(this.suggestions.url);
      if (this.xhr) {
        this.xhr.abort();
      }
      this.xhr = this.suggestions.fetch();
      return this.cursor.end = cursor;
    }
  },
  hide: function() {
    this.$el.hide();
    return this.available = false;
  },
  render: function() {
    var html;
    this.context.suggestions = this.suggestions.toJSON();
    html = tpl['dashboard/typeahead'](this.context);
    this.$el.html(html);
    this.$el.show();
    return this;
  }
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.CreateProjectForm = (function(_super) {

  __extends(CreateProjectForm, _super);

  function CreateProjectForm() {
    return CreateProjectForm.__super__.constructor.apply(this, arguments);
  }

  CreateProjectForm.prototype.el = "#create-project-inline";

  CreateProjectForm.prototype.view = "dashboard/create_project";

  CreateProjectForm.prototype.success = function(model, response, options) {
    var projectId;
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.EditProjectForm = (function(_super) {

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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.CreateTaskForm = (function(_super) {

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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.CreateTaskCommentForm = (function(_super) {

  __extends(CreateTaskCommentForm, _super);

  function CreateTaskCommentForm() {
    return CreateTaskCommentForm.__super__.constructor.apply(this, arguments);
  }

  CreateTaskCommentForm.prototype.view = "dashboard/create_task_comment";

  CreateTaskCommentForm.prototype.success = function(model, response, options) {
    if (CreateTaskCommentForm.__super__.success.call(this, model, response, options)) {
      return app.meta.tasks.fetch();
    }
  };

  CreateTaskCommentForm.prototype.initialize = function(context) {
    this.model = new models.TaskComment;
    this.model.url = "/task/comment/" + context.taskId;
    return CreateTaskCommentForm.__super__.initialize.call(this, context);
  };

  return CreateTaskCommentForm;

})(InlineForm);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.Task = (function(_super) {

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
    html = tpl['dashboard/task'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'dashboard-task');
    return this;
  };

  return Task;

})(View);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

views.Search = (function(_super) {

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
    html = tpl['dashboard/search'](this.context);
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


views.Dashboard = View.extend({
  events: {
    'click .project-list li a': "editProject",
    'click .project-list li': "switchProject",
    'click #create-project-button': "showProjectForm",
    'click #create-subproject-button': "showSubProjectForm",
    'click #delete-project-button': "deleteProject",
    'click #create-task-button': "showTaskForm",
    'click #task-add-comment-button': "showTaskCommentForm",
    'click #task-list li': "openTask"
  },
  clearHref: function(href) {
    return href.replace("/" + this.context.dashboard_url, "");
  },
  parsePermissions: function(user, project) {
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
  },
  openTask: function(e) {
    if (typeof e !== 'object') {
      this.taskId = e;
    } else {
      e.preventDefault();
      this.taskId = $(e.currentTarget).attr("rel");
    }
    this.task = this.tasks.get(this.taskId);
    app.navigate("/dashboard/project/" + this.projectId + "/task/" + this.taskId, {
      trigger: false
    });
    this.context.task = this.task.toJSON();
    return this.taskView = new views.Task(_.extend(this.context, {
      el: "#main-area"
    }));
  },
  editProject: function(e) {
    var editProjectForm;
    e.preventDefault();
    this.projectId = e.target.attributes['rel'].value;
    this.project = this.projects.get(this.projectId);
    this.context.projectId = this.projectId;
    this.context.project = this.project.toJSON();
    this.context.model = this.project;
    this.parsePermissions(this.context.user, this.context.project);
    editProjectForm = new views.EditProjectForm(this.context);
    return editProjectForm.show();
  },
  deleteProject: function(e) {
    var _this = this;
    e.preventDefault();
    this.project.url = "/project/" + this.projectId;
    return this.project.destroy({
      success: function(model, response) {
        _this.context.project = _this.project = null;
        _this.context.projectId = _this.projectId = "";
        return _this.projects.fetch();
      }
    });
  },
  showSubProjectForm: function(e) {
    e.preventDefault();
    if (this.createProject != null) {
      this.createProject.undelegateEvents();
    }
    this.createProject = new views.CreateProjectForm(this.context);
    return this.createProject.show();
  },
  showProjectForm: function(e) {
    e.preventDefault();
    this.context.project = null;
    if (this.createProject != null) {
      this.createProject.undelegateEvents();
    }
    this.createProject = new views.CreateProjectForm(this.context);
    return this.createProject.show();
  },
  showTaskForm: function(e) {
    e.preventDefault();
    if (this.createTask != null) {
      this.createTask.undelegateEvents();
    }
    this.createTask = new views.CreateTaskForm(this.context);
    return this.createTask.show();
  },
  showTaskCommentForm: function(e) {
    var createTaskComment;
    e.preventDefault();
    e.stopPropagation();
    createTaskComment = new views.CreateTaskCommentForm(_.extend(this.context, {
      el: "#task-add-comment-" + this.taskId
    }, {
      taskId: this.taskId
    }));
    return createTaskComment.show();
  },
  switchProject: function(e) {
    if (typeof e !== 'object') {
      this.projectId = e;
    } else {
      this.projectId = e.target.attributes['rel'].value;
    }
    this.project = this.projects.get(this.projectId);
    this.context.projectId = this.projectId;
    this.context.project = this.project.toJSON();
    this.parsePermissions(this.context.user, this.context.project);
    app.navigate("/dashboard/project/" + this.projectId, {
      trigger: false
    });
    this.taskId = null;
    this.tasks.url = "/task/" + this.projectId;
    return this.tasks.fetch();
  },
  initialize: function(params) {
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
    this.projects = app.meta.projects;
    this.tasks = app.meta.tasks;
    _.bindAll(this, "updateProjectList", "updateTaskList", "switchProject", "showTaskCommentForm");
    this.listenTo(this.projects, "sync", this.updateProjectList);
    this.listenTo(this.tasks, "sync", this.updateTaskList);
    this.projectId = params.project;
    this.taskId = params.task;
    return this.projects.fetch();
  },
  updateProjectList: function(collection) {
    this.context.projects = collection.toJSON();
    if (this.projectId) {
      if (this.taskId) {
        this.tasks.url = "/task/" + this.projectId;
        this.tasks.fetch();
      } else {
        return this.switchProject(this.projectId);
      }
    }
    return this.render();
  },
  updateTaskList: function(collection) {
    this.context.tasks = collection.toJSON();
    if (this.taskId) {
      return this.openTask(this.taskId);
    }
    return this.render();
  },
  setParent: function(parent, child) {
    var _this = this;
    return $.get("/project/parent/" + parent + "/" + child, function(response, status, xhr) {
      return _this.projects.fetch();
    });
  },
  render: function() {
    var html,
      _this = this;
    html = tpl['dashboard/dashboard'](this.context);
    this.$el.html(html);
    this.$el.attr('view-id', 'dashboard');
    $(".project-list li").droppable({
      drop: function(event, ui) {
        return _this.setParent(event.target.attributes['rel'].value, ui.draggable.attr("rel"));
      }
    }).draggable({
      containment: "parent"
    });
    if (!(this.projectId || this.taskId)) {
      this.searchView = new views.Search(_.extend(this.context, {
        el: "#main-area"
      }));
    }
    return this;
  }
});

var __slice = [].slice;

views.AdminBoard = View.extend({
  events: {
    'click a.backbone': "route"
  },
  route: function(e) {
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
  },
  empty: function() {
    var opts;
    opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    this.informationBox.children().detach();
    if (opts != null) {
      return this.informationBox.append(opts);
    }
  },
  action: function(action, get) {
    var bill, billId, billView, model, username;
    switch (action) {
      case "users_with_stripe":
        this.empty(this.stripeUsers.$el);
        break;
      case "issue_bill":
        username = get[0];
        model = this.stripeUsers.collection.get(username);
        this.issueBill = new views.IssueBill({
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
        } catch (e) {
          bill = new models.Bill({
            _id: billId
          });
          bill.fetch();
        } finally {
          billView = new views.Bill({
            model: bill
          });
          this.empty(billView.$el);
        }
    }
    return this.delegateEvents();
  },
  initialize: function() {
    console.log("[__Admin View__] init");
    this.model = app.session;
    this.listenTo(this.model, "sync", this.render);
    this.stripeUsers = new views.UsersWithStripe;
    return this.render();
  },
  render: function() {
    var html;
    this.context.user = this.model.toJSON();
    html = tpl['admin/admin'](this.context);
    this.$el.html(html);
    this.informationBox = this.$(".informationBox");
    this.action.call(this, this.options.action, this.options.get);
    return this;
  }
});


views.IssueBill = Backbone.View.extend({
  events: {
    "submit form": "onSubmit"
  },
  onSubmit: function(e) {
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
  },
  billIssued: function(model, response, options) {
    this.$("[type=submit]").removeClass("disabled").text("Issue Bill");
    this.bill.set(response.bill);
    this.issuedBills.add(this.bill);
    return this.prepareForm();
  },
  billError: function(model, xhr, options) {
    return console.log("Error", xhr);
  },
  validationErrors: function(model, errors) {
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
  },
  clearErrors: function() {
    this.globalError.empty();
    return this.$(".control-group.error").removeClass("error").find(".help-inline").remove();
  },
  prepareForm: function() {
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
  },
  initialize: function() {
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
  },
  listIssuedBills: function() {
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
  },
  renderBills: function() {
    var html;
    html = tpl['bills/table']({
      bills: this.issuedBills.toJSON(),
      view_bills: "/admin/bills"
    });
    return this.$(".bills").html(html);
  },
  render: function() {
    var html;
    if (this.model != null) {
      this.context.user = this.model.toJSON();
    }
    html = tpl['admin/bill'](this.context);
    this.$el.html(html);
    this.globalError = this.$("legend .error");
    return this;
  }
});


views.UsersWithStripe = Backbone.View.extend({
  initialize: function() {
    this.collection = new collections.UsersWithStripe;
    this.context = {};
    return this.listenTo(this.collection, "sync", this.render);
  },
  render: function() {
    var html;
    this.context.users = this.collection.toJSON();
    html = tpl['admin/users_with_stripe'](this.context);
    this.$el.html(html);
    return this;
  }
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

(function(exports) {
  /*
    Configuring plugins
  */

  var App, conf, routes;
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
  routes = [
    {
      key: "(!/)",
      name: "index"
    }, {
      key: "(!/)" + conf.discover_url + "(?:params)",
      name: "discover"
    }, {
      key: "(!/)" + conf.signin_url,
      name: "login"
    }, {
      key: "(!/)" + conf.profile_url + "(/:action)(/:profile)",
      name: "profile"
    }, {
      key: "(!/)" + conf.how_to_url,
      name: "how-to"
    }, {
      key: "(!/)" + conf.modules_url,
      name: "language_list"
    }, {
      key: "(!/)" + conf.modules_url + "/:language",
      name: "repo_list"
    }, {
      key: "(!/)" + conf.modules_url + "/:language/:repo",
      name: "repo"
    }, {
      key: "(!/)" + conf.dashboard_url,
      name: "dashboard"
    }, {
      key: "(!/)" + conf.dashboard_url + "/project/:id",
      name: "project"
    }, {
      key: "(!/)" + conf.dashboard_url + "/project/:project/task/:task",
      name: "task"
    }, {
      key: "(!/)" + conf.admin_url + "(/:action)(/:subaction)",
      name: "admin"
    }
  ];
  return $(document).ready(function() {
    var app, router,
      _this = this;
    router = {};
    _.each(routes, function(route) {
      return router[route.key] = route.name;
    });
    App.prototype.routes = router;
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
