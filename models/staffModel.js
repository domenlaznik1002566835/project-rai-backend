var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var staffSchema = new Schema({
	'firstName' : String,
	'lastName' : String,
	'email' : String,
	'password' : String,
	'level' : Number,
	'created' : { type: Date, default: Date.now },
	'updated' : { type: Date, default: Date.now }
});

module.exports = mongoose.model('staff', staffSchema);
