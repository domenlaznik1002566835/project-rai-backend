var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var clientSchema = new Schema({
	'firstName' : String,
	'lastName' : String,
	'email' : String,
	'password' : String
});

clientSchema.pre('save', function(next) {
	var client = this;

    if (!client.isModified('password')) return next();

	bcrypt.hash(client.password,10,function(err,hash){
		if(err){
			return next(err);
		}
		client.password = hash;
		next();
	});
});

module.exports = mongoose.model('client', clientSchema);
