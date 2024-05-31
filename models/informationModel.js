var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var informationSchema = new Schema({
	'title' : String,
	'text' : String,
	'image' : String,
	'date' : String,
	'created' : { type: Date, default: Date.now },
	'updated' : { type: Date, default: Date.now }
});

module.exports = mongoose.model('information', informationSchema);
