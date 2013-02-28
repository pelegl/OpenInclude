schema =
  date: Date #date of payment
	rate: Number #payment rate
	fee:  Number #fee to our system
	hours: Number #hours
	client: ObjectId #client that paid
	receivepayment: Number #developer or project manager that receives the payment
#Schema.plugin require("./plugins/stripe")
exports.schema = schema
