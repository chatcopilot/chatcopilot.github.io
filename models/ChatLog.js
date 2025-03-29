const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    userAgent: String,
    ipAddress: String,
    page: String,
    question: String,
    answer: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatLog', chatLogSchema); 