const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Update user preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();

    res.json({
      success: true,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add favorite device
router.post('/favorites', protect, async (req, res) => {
  try {
    const { deviceId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.preferences.favoriteDevices.includes(deviceId)) {
      user.preferences.favoriteDevices.push(deviceId);
      await user.save();
    }

    res.json({
      success: true,
      favorites: user.preferences.favoriteDevices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Remove favorite device
router.delete('/favorites/:deviceId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.preferences.favoriteDevices = user.preferences.favoriteDevices.filter(
      id => id.toString() !== req.params.deviceId
    );
    await user.save();

    res.json({
      success: true,
      favorites: user.preferences.favoriteDevices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

