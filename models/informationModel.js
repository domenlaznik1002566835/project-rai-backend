var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var informationSchema = new Schema({
	'title' : String,
	'text' : String,
	'image' : String,
	'date' : String
});

module.exports = mongoose.model('information', informationSchema);
