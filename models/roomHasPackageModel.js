var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var roomHasPackageSchema = new Schema({
	'roomId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'room'
	},
	'packageId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'package'
	}
});

module.exports = mongoose.model('roomHasPackage', roomHasPackageSchema);
