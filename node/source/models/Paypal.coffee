schema =
  amount: Number #amount withdrawn
	date: Date #date if withdrawal
	Schema.plugin require("./plugins/paypal")
	
exports.schema = schema