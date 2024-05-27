var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var video2FASchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    videoPath: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

var Video2FAModel = mongoose.model('Video2FA', video2FASchema);

module.exports = Video2FAModel;
