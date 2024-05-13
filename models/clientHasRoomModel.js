var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var clientHasRoomSchema = new Schema({
	'clientId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'client'
	},
	'roomId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'room'
	},
	'contractCreated' : String,
	'contractEnds' : String
});

module.exports = mongoose.model('clientHasRoom', clientHasRoomSchema);
