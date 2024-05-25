var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageSchema = new Schema({
    code: { type: String, required: true },
    openTimestamp: { type: Date, default: null },
    closeTimestamp: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
