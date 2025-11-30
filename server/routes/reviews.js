const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Device = require('../models/Device');
const sentimentService = require('../services/SentimentService');
const { protect, optional } = require('../middleware/auth');

// Get reviews for a device
router.get('/:deviceId', optional, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ device: req.params.deviceId })
            .populate('user', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ device: req.params.deviceId });

        // Calculate aggregate sentiment stats if needed (optional optimization)

        res.json({
            success: true,
            reviews,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a review
router.post('/:deviceId', protect, async (req, res) => {
    try {
        const { rating, content } = req.body;
        const deviceId = req.params.deviceId;
        const userId = req.user.id;

        // Check if user already reviewed this device
        const existingReview = await Review.findOne({ user: userId, device: deviceId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this device' });
        }

        // Analyze sentiment
        console.log('Analyzing sentiment for review...');
        const sentiment = await sentimentService.analyzeSentiment(content);
        const { pros, cons } = await sentimentService.extractProsCons(content);

        const review = await Review.create({
            user: userId,
            device: deviceId,
            rating,
            content,
            sentimentScore: sentiment.score,
            sentimentLabel: sentiment.label,
            pros,
            cons
        });

        // Update Device stats
        const stats = await Review.aggregate([
            { $match: { device: new mongoose.Types.ObjectId(deviceId) } },
            {
                $group: {
                    _id: '$device',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Device.findByIdAndUpdate(deviceId, {
                averageRating: stats[0].avgRating,
                reviewCount: stats[0].count
            });
        }

        // Populate user details for immediate display
        await review.populate('user', 'name image');

        res.status(201).json({
            success: true,
            review
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

const mongoose = require('mongoose');

module.exports = router;
