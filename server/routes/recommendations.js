const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const User = require('../models/User');
const { protect, optional } = require('../middleware/auth');

// Advanced recommendation algorithm
const calculateScore = (device, userAnswers) => {
  let score = 0;
  const reasons = [];

  // 1. Ecosystem Match (Weight: 20%)
  const ecosystem = userAnswers.tech_context?.ecosystem;
  const brand = device.brand.toLowerCase();

  if (ecosystem === 'apple') {
    if (brand === 'apple') {
      score += 20;
      reasons.push("Perfect for your Apple ecosystem");
    }
  } else if (ecosystem === 'google' || ecosystem === 'android') {
    if (brand !== 'apple') {
      score += 10;
      if (brand === 'google' || brand === 'samsung') {
        score += 10;
        reasons.push("Seamless integration with Google/Android");
      }
    }
  } else if (ecosystem === 'windows') {
    if (device.category === 'laptop' && brand !== 'apple') {
      score += 20;
      reasons.push("Great for your Windows workflow");
    }
  }

  // 2. Budget Match (Weight: 25%)
  const budgetStyle = userAnswers.priorities?.budget_style;
  const price = device.prices && device.prices.length > 0
    ? device.prices.reduce((sum, p) => sum + p.price, 0) / device.prices.length
    : 0;

  if (price > 0) {
    if (budgetStyle === 'value') {
      if (price < 600) {
        score += 25;
        reasons.push("Fits your value-focused budget");
      } else if (price < 800) score += 15;
    } else if (budgetStyle === 'balanced') {
      if (price >= 500 && price <= 1200) {
        score += 25;
        reasons.push("Matches your balanced budget preference");
      } else if (price < 500 || price < 1500) score += 15;
    } else if (budgetStyle === 'premium' || budgetStyle === 'future') {
      if (price > 1000) {
        score += 25;
        reasons.push("Premium device with top-tier features");
      } else score += 15;
    }
  }

  // 3. Usage & Lifestyle Match (Weight: 30%)
  const lifestyle = userAnswers.lifestyle?.type;
  const workflow = userAnswers.usage?.workflow;
  const specs = device.specifications || {};
  const ram = parseInt(specs.memory?.ram) || 0;
  const storage = parseInt(specs.memory?.storage) || 0;
  const processor = specs.processor?.name?.toLowerCase() || '';

  // Gamer
  if (lifestyle === 'gamer' || userAnswers.lifestyle?.downtime?.includes('gaming')) {
    if (ram >= 12 || processor.includes('snapdragon 8') || processor.includes('pro') || processor.includes('max')) {
      score += 15;
      reasons.push("Powerhouse performance for gaming");
    }
    if (specs.display?.refreshRate?.includes('120') || specs.display?.refreshRate?.includes('144')) {
      score += 15;
      reasons.push("High refresh rate display");
    }
  }

  // Creative/Creator
  if (lifestyle === 'creative' || workflow === 'creator') {
    if (storage >= 512 || ram >= 16) {
      score += 15;
      reasons.push("High storage & RAM for content creation");
    }
    if (specs.display?.resolution?.includes('4K') || specs.display?.type?.includes('OLED')) {
      score += 15;
      reasons.push("Color-accurate, high-res display");
    }
  }

  // Corporate/Student (Productivity)
  if (lifestyle === 'student' || lifestyle === 'corporate' || workflow === 'focus') {
    if (parseInt(specs.battery?.capacity) >= 4500 || specs.battery?.life?.includes('hour')) {
      score += 15;
      reasons.push("All-day battery life for work/study");
    }
    score += 15; // General productivity boost
  }

  // 4. Priorities Ranking (Weight: 25%)
  const rankedPriorities = userAnswers.priorities?.ranked || [];

  rankedPriorities.slice(0, 3).forEach((priority, index) => {
    const weight = index === 0 ? 15 : (index === 1 ? 7 : 3); // Weighted top 3

    switch (priority) {
      case 'camera':
        if (specs.camera?.rear?.includes('MP') || specs.camera?.score > 80) {
          score += weight;
          if (index === 0) reasons.push("Top-tier camera system");
        }
        break;
      case 'battery':
        if (parseInt(specs.battery?.capacity) >= 5000) {
          score += weight;
          if (index === 0) reasons.push("Exceptional battery life");
        }
        break;
      case 'performance':
        if (ram >= 12 || processor.includes('gen 3') || processor.includes('bionic')) {
          score += weight;
          if (index === 0) reasons.push("Blazing fast performance");
        }
        break;
      case 'display':
        if (specs.display?.type?.includes('OLED') || specs.display?.type?.includes('AMOLED')) {
          score += weight;
          if (index === 0) reasons.push("Stunning display quality");
        }
        break;
      case 'portability':
        if (device.category === 'mobile' || (device.weight && parseInt(device.weight) < 1.5)) {
          score += weight;
          if (index === 0) reasons.push("Lightweight and portable");
        }
        break;
    }
  });

  // Cap score at 100
  score = Math.min(100, score);

  // Ensure at least some score if it's a valid device in the category
  if (score === 0) score = 40;

  return { score, reasons: [...new Set(reasons)].slice(0, 3) }; // Return unique top 3 reasons
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

    // Determine category from quiz or default to mobile
    // Note: The quiz doesn't explicitly ask "What device do you want?" in the new design
    // It infers from context or we can default to showing a mix or specific category if asked.
    // For now, let's assume we recommend Smartphones as the primary, or infer from 'devices_owned' gaps?
    // Let's default to 'mobile' for this implementation as it's the most common, 
    // or check if they expressed interest in something specific.
    const category = 'mobile';

    const devices = await Device.find({ category });

    const scoredDevices = devices.map(device => {
      const { score, reasons } = calculateScore(device, user.quizAnswers);
      return {
        device,
        score,
        reasons
      };
    });

    scoredDevices.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      recommendations: scoredDevices.slice(0, 10).map(item => item.device),
      scores: scoredDevices.slice(0, 10).map(item => ({ score: item.score, reasons: item.reasons }))
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get quick recommendations (without auth)
router.post('/quick', async (req, res) => {
  try {
    const { deviceType = 'mobile', budgetRange, usageType = [], priorities = [] } = req.body;

    // 1. Filter candidates by hard constraints (Category & Budget)
    // We still want to respect the category (phone vs laptop) and rough budget
    let priceQuery = {};
    if (budgetRange) {
      const budgetMap = {
        'under-500': { $lte: 500 },
        '500-1000': { $gte: 500, $lte: 1000 },
        '1000-2000': { $gte: 1000, $lte: 2000 },
        '2000-3000': { $gte: 2000, $lte: 3000 },
        'above-3000': { $gte: 3000 }
      };
      if (budgetMap[budgetRange]) {
        priceQuery = { 'prices.price': budgetMap[budgetRange] };
      }
    }

    const devices = await Device.find({
      category: deviceType,
      ...priceQuery
    }).limit(50); // Get a candidate pool

    if (devices.length === 0) {
      return res.json({ success: true, recommendations: [] });
    }

    // 2. Construct User Profile String for ML
    // "I want a mobile phone for gaming and photography. My priorities are performance and camera."
    const userProfile = `I want a ${deviceType} for ${usageType.join(' and ')}. My priorities are ${priorities.join(' and ')}.`;

    // 3. Use ML to find best semantic matches
    try {
      const mlService = require('../services/mlService');

      const recommendations = await mlService.findTopMatches(
        userProfile,
        devices,
        (device) => {
          // Construct Device Description String
          // "Samsung Galaxy S24 Ultra. Snapdragon 8 Gen 3. 200MP Camera. 5000mAh Battery."
          const specs = device.specifications || {};
          const processor = specs.processor?.name || '';
          const camera = specs.camera?.rear || '';
          const battery = specs.battery?.capacity || '';
          const description = device.description || '';

          return `${device.name}. ${description}. ${processor}. ${camera}. ${battery}`;
        }
      );

      // Return top 10
      res.json({
        success: true,
        recommendations: recommendations.slice(0, 10).map(r => r.item),
        debug: {
          userProfile,
          scores: recommendations.slice(0, 5).map(r => ({ name: r.item.name, score: r.score }))
        }
      });

    } catch (mlError) {
      console.error('ML Service Error, falling back to rule-based:', mlError);
      // Fallback to original rule-based logic if ML fails
      const mockAnswers = { deviceType, budgetRange, usageType, priorities };
      const scoredDevices = devices.map(device => ({
        device,
        score: calculateScore(device, mockAnswers)
      }));
      scoredDevices.sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        recommendations: scoredDevices.slice(0, 10).map(item => item.device)
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

