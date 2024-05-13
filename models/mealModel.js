var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var mealSchema = new Schema({
	'name' : String,
	'calories' : String,
	'price' : Number,
	'image': String,
	'ingredients' : Array
});

module.exports = mongoose.model('meal', mealSchema);
