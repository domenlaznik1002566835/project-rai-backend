var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var clientHasRoomSchema = new Schema({
	'clientId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'client'
	},
	'room:' : Number,
	'contractCreated' : String,
	'contractEnds' : String
});

module.exports = mongoose.model('clientHasRoom', clientHasRoomSchema);
