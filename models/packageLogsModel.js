var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageLogsSchema = new Schema({
	'code' : Number,
	'openedBy' : String,
	'type' : Boolean,
	'date' : Date
});

module.exports = mongoose.model('packageLogs', packageLogsSchema);
