const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const User = require('../models/User');
const { protect, optional } = require('../middleware/auth');

// Advanced recommendation algorithm
const calculateScore = (device, userAnswers) => {
  let score = 0;

  // Budget match (weight: 30%)
  if (userAnswers.budgetRange && device.prices.length > 0) {
    const avgPrice = device.prices.reduce((sum, p) => sum + p.price, 0) / device.prices.length;
    const budgetMap = {
      'under-500': [0, 500],
      '500-1000': [500, 1000],
      '1000-2000': [1000, 2000],
      '2000-3000': [2000, 3000],
      'above-3000': [3000, Infinity]
    };
    const [min, max] = budgetMap[userAnswers.budgetRange] || [0, Infinity];
    if (avgPrice >= min && avgPrice <= max) {
      score += 30;
    } else {
      const diff = Math.min(Math.abs(avgPrice - min), Math.abs(avgPrice - max));
      score += Math.max(0, 30 - (diff / 100));
    }
  }

  // Brand preference (weight: 15%)
  if (userAnswers.preferredBrands && userAnswers.preferredBrands.length > 0) {
    if (userAnswers.preferredBrands.some(b => 
      device.brand.toLowerCase().includes(b.toLowerCase())
    )) {
      score += 15;
    }
  }

  // Usage type match (weight: 25%)
  if (userAnswers.usageType && userAnswers.usageType.length > 0) {
    const usageScores = {
      gaming: () => {
        const ram = parseInt(device.specifications?.memory?.ram) || 0;
        const processor = device.specifications?.processor?.name?.toLowerCase() || '';
        let usageScore = 0;
        if (ram >= 8) usageScore += 5;
        if (ram >= 16) usageScore += 5;
        if (processor.includes('snapdragon') || processor.includes('intel') || processor.includes('amd')) usageScore += 5;
        return usageScore;
      },
      productivity: () => {
        const ram = parseInt(device.specifications?.memory?.ram) || 0;
        const storage = parseInt(device.specifications?.memory?.storage) || 0;
        let usageScore = 0;
        if (ram >= 8) usageScore += 5;
        if (storage >= 256) usageScore += 5;
        return usageScore;
      },
      photography: () => {
        const camera = device.specifications?.camera?.rear || '';
        let usageScore = 0;
        if (camera.includes('MP') || camera.includes('megapixel')) usageScore += 10;
        return usageScore;
      },
      video: () => {
        const camera = device.specifications?.camera?.video || '';
        const storage = parseInt(device.specifications?.memory?.storage) || 0;
        let usageScore = 0;
        if (camera.includes('4K') || camera.includes('8K')) usageScore += 5;
        if (storage >= 256) usageScore += 5;
        return usageScore;
      }
    };

    userAnswers.usageType.forEach(usage => {
      const calc = usageScores[usage];
      if (calc) {
        score += calc();
      }
    });
  }

  // Priorities match (weight: 20%)
  if (userAnswers.priorities && userAnswers.priorities.length > 0) {
    userAnswers.priorities.forEach(priority => {
      switch(priority) {
        case 'battery':
          const battery = parseInt(device.specifications?.battery?.capacity) || 0;
          if (battery >= 4000) score += 5;
          break;
        case 'display':
          const resolution = device.specifications?.display?.resolution || '';
          if (resolution.includes('4K') || resolution.includes('1440')) score += 5;
          break;
        case 'storage':
          const storage = parseInt(device.specifications?.memory?.storage) || 0;
          if (storage >= 256) score += 5;
          break;
        case 'performance':
          const ram = parseInt(device.specifications?.memory?.ram) || 0;
          if (ram >= 8) score += 5;
          break;
      }
    });
  }

  // Device type match (weight: 10%)
  if (userAnswers.deviceType === device.category) {
    score += 10;
  }

  return score;
};

// Get personalized recommendations
router.post('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.quizCompleted || !user.quizAnswers) {
      return res.status(400).json({
        success: false,
        message: 'Please complete the quiz first'
      });
    }

    const category = user.quizAnswers.deviceType || 'mobile';
    const devices = await Device.find({ category });

    const scoredDevices = devices.map(device => ({
      device,
      score: calculateScore(device, user.quizAnswers)
    }));

    scoredDevices.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      recommendations: scoredDevices.slice(0, 10).map(item => item.device),
      scores: scoredDevices.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get quick recommendations (without auth)
router.post('/quick', async (req, res) => {
  try {
    const { deviceType = 'mobile', budgetRange, usageType = [] } = req.body;
    const devices = await Device.find({ category: deviceType }).limit(20);

    const mockAnswers = { deviceType, budgetRange, usageType };
    const scoredDevices = devices.map(device => ({
      device,
      score: calculateScore(device, mockAnswers)
    }));

    scoredDevices.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      recommendations: scoredDevices.slice(0, 10).map(item => item.device)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

