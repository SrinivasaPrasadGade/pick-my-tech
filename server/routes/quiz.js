const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Submit quiz answers
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.quizCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed'
      });
    }

    const quizAnswers = req.body;
    user.quizAnswers = quizAnswers;
    user.quizCompleted = true;
    await user.save();

    res.json({
      success: true,
      message: 'Quiz completed successfully',
      quizAnswers: user.quizAnswers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get quiz status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      quizCompleted: user.quizCompleted,
      quizAnswers: user.quizAnswers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update quiz answers (admin/optional)
router.put('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const quizAnswers = req.body;
    
    user.quizAnswers = { ...user.quizAnswers, ...quizAnswers };
    await user.save();

    res.json({
      success: true,
      message: 'Quiz answers updated',
      quizAnswers: user.quizAnswers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

