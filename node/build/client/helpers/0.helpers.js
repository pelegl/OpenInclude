// Generated by CoffeeScript 1.6.1

(function(exports, isServer) {
  var root;
  if (isServer) {
    this.Backbone = require('backbone');
  }
  root = this;
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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