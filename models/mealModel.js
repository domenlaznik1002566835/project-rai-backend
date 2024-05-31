var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var mealSchema = new Schema({
	'name' : String,
	'calories' : String,
	'price' : Number,
	'image': String,
	'ingredients' : Array,
	'created' : { type: Date, default: Date.now },
	'updated' : { type: Date, default: Date.now }
});

module.exports = mongoose.model('meal', mealSchema);
