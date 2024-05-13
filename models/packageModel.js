var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageSchema = new Schema({
	'code' : String
});

module.exports = mongoose.model('package', packageSchema);
