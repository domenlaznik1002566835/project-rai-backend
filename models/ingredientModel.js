var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ingredientSchema = new Schema({
	'name' : String,
	'calories' : Number,
	'vegetarian' : Boolean
});

module.exports = mongoose.model('ingredient', ingredientSchema);
