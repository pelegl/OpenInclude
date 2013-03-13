// Generated by CoffeeScript 1.6.1
var PaymentController, Stripe, User, esClient, get_models, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_ref = require('../conf'), get_models = _ref.get_models, esClient = _ref.esClient;

_ref1 = get_models(["Stripe", "User"]), Stripe = _ref1[0], User = _ref1[1];

PaymentController = (function(_super) {

  __extends(PaymentController, _super);

  function PaymentController(req, res) {
    this.req = req;
    this.res = res;
    this.context = {
      title: "payment"
    };
    PaymentController.__super__.constructor.apply(this, arguments);
  }

  PaymentController.prototype.index = function() {
    this.context.body = this._view('payment/index', this.context);
    return this.res.render('base', this.context);
  };

  PaymentController.prototype.test = function() {
    var _this = this;
    return User.get_user('261220', function(err, user) {
      return _this.res.send(user);
    });
  };

  PaymentController.prototype.addCustomer = function() {
    var _this = this;
    return Stripe.addCustomer('261220', "Tom Hanks", "371449635398431", "4", "2014", "222", function(err, customer) {
      if (!err) {
        console.log(customer);
        _this.res.send(customer);
        return _this.res.statusCode = 201;
      } else {
        console.log(err);
        _this.res.send(err);
        return _this.res.statusCode = 500;
      }
    });
  };

  PaymentController.prototype.billCustomer = function() {
    var _this = this;
    return Stripe.billCustomer("261220", "500", function(err, charge) {
      var billed, stripeObj;
      if (!err) {
        stripeObj = {
          chargeid: charge.id,
          date: charge.created
        };
        billed = new Stripe(stripeObj);
        return billed.save(function(error, stripe) {
          if (!error) {
            _this.res.send(charge);
            return _this.res.statusCode = 201;
          } else {
            _this.res.send(error);
            return _this.res.statusCode = 500;
          }
        });
      } else {
        _this.res.send(err);
        return _this.res.statusCode = 500;
      }
    });
  };

  return PaymentController;

})(require('./basicController'));

module.exports = function(req, res) {
  return new PaymentController(req, res);
};