const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    content: {
        type: String,
        required: true
    },
    sentimentScore: {
        type: Number,
        default: 0
    },
    sentimentLabel: {
        type: String,
        enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
        default: 'NEUTRAL'
    },
    pros: [{
        type: String
    }],
    cons: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
reviewSchema.index({ device: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

module.exports = mongoose.model('Review', reviewSchema);
