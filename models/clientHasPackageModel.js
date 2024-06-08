var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var clientHasPackageSchema = new Schema({
	'client' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'clientModel'
	},
	'package' : Number,
	'start' : Date,
	'end' : Date
});

module.exports = mongoose.model('clientHasPackage', clientHasPackageSchema);
