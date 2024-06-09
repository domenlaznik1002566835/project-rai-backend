var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roomSchema = new Schema({
	'number' : { type: Number, unique: true },
	'size' : Number,
	'type' : Number,
	'occupied' : Boolean,
	'created' : { type: Date, default: Date.now },
	'updated' : { type: Date, default: Date.now }
});

module.exports = mongoose.model('room', roomSchema);