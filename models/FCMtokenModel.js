const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fcmTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  fcmToken: { type: String, required: true }
});

const FCMTokenModel = mongoose.model('FCMToken', fcmTokenSchema);

module.exports = FCMTokenModel;
