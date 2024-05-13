var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var staffSchema = new Schema({
	'firstName' : String,
	'lastName' : String,
	'username' : String,
	'password' : String,
	'level' : Number
});

module.exports = mongoose.model('staff', staffSchema);
