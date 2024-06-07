var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bycrypt = require('bcrypt');

var staffSchema = new mongoose.Schema({
	'firstName' : String,
	'lastName' : String,
	'email' : String,
	'password' : {
		type: String,
		required: true
	},
	'level' : Number,
	'created' : { type: Date, default: Date.now },
	'updated' : { type: Date, default: Date.now }
});

staffSchema.pre('save', function(next) {
	var staff = this;

	if (!staff.isModified('password')) return next();

	bycrypt.hash(staff.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		staff.password = hash;
		next();
	});
});

const StaffModel = mongoose.model('staff', staffSchema);
module.exports = mongoose.model('staff', staffSchema);
