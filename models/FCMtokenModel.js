const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fcmTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, required: true, enum: ['Client', 'Staff'] },
  fcmToken: { type: String, required: true }
});

const FCMTokenModel = mongoose.model('FCMToken', fcmTokenSchema);

module.exports = FCMTokenModel;
