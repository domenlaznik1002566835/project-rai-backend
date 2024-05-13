var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var orderSchema = new Schema({
	'orderedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'client'
	},
	'meals' : Array,
	'price' : Number
});

module.exports = mongoose.model('order', orderSchema);
