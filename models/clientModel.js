async function authenticate(email, password) {
    try {
        var user = await this.findOne({ email: email }).exec();
        if (!user) {
            let StaffModel = require('./staffModel');
            user = await StaffModel.findOne({ email: email }).exec();
            if (!user) {
                throw new Error('User not found.');
            }
        }

        const result = await bcrypt.compare(password, user.password);
        if (result === true) {
            return user;
        } else {
            throw new Error('Invalid password.');
        }
    } catch (err) {
        throw err;
    }
}

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    video2FAs: [{ type: Schema.Types.ObjectId, ref: 'Video2FA' }]
});

clientSchema.pre('save', function(next) {
    var client = this;

    if (!client.isModified('password')) return next();

    bcrypt.hash(client.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        client.password = hash;
        next();
    });
});

clientSchema.statics.authenticate = async function(email, password) {
    try {
        const user = await this.findOne({ email: email }).exec();
        if (!user) {
            throw new Error('User not found.');
        }

        const result = await bcrypt.compare(password, user.password);
        if (result === true) {
            return user;
        } else {
            throw new Error('Invalid password.');
        }
    } catch (err) {
        throw err;
    }
};

var ClientModel = mongoose.model('Client', clientSchema);

module.exports = ClientModel;
module.exports.authenticate = authenticate;
