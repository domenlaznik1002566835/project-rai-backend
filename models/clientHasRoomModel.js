var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var clientHasRoomSchema = new Schema({
	'clientId' : {
		type: Schema.Types.ObjectId,
		ref: 'client'
	},
	'room' : Number, // Corrected here
	'contractCreated' : Date,
	'contractEnds' : Date
});

module.exports = mongoose.model('clientHasRoom', clientHasRoomSchema);
