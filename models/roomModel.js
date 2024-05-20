var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roomSchema = new Schema({
	'number' : Number,
	'size' : Number,
	'occupied' : Boolean
});

module.exports = mongoose.model('room', roomSchema);