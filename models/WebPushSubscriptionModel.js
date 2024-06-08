const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const webPushSubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, required: true, enum: ['Client', 'Staff'] },
  webPushSubscription: { type: Object, required: true }
});

const WebPushSubscriptionModel = mongoose.model('WebPushSubscription', webPushSubscriptionSchema);

module.exports = WebPushSubscriptionModel;
