const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const Device = require('../models/Device');

// Enhanced rule-based chatbot
const getChatbotResponse = async (message, userId) => {
  const lowerMessage = message.toLowerCase().trim();

  // Navigation help
  if (lowerMessage.includes('help') || lowerMessage.includes('navigate') || lowerMessage === '?') {
    return {
      response: "I'm Maverick, your tech assistant! I can help you:\n\n📱 Find devices (mobiles, laptops, tablets, smartwatches, headphones)\n💻 Compare specifications\n⭐ Get personalized recommendations\n📰 Show tech news\n💰 Find devices by budget\n🏷️ Search by brand (Apple, Samsung, Google, Dell, etc.)\n\nTry asking:\n- 'Show me gaming laptops'\n- 'Find phones under $500'\n- 'Compare iPhone and Samsung'\n- 'Latest tech news'",
      suggestions: ['Find gaming laptops', 'Show recommendations', 'Browse phones', 'Tech news']
    };
  }

  // Device search with actual query
  if (lowerMessage.includes('show') || lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('browse') || lowerMessage.includes('list')) {
    let deviceType = 'mobile';
    let brand = null;
    
    // Extract device type
    if (lowerMessage.match(/(mobile|phone|smartphone|iphone|android)/)) {
      deviceType = 'mobile';
    } else if (lowerMessage.match(/(laptop|macbook|notebook)/)) {
      deviceType = 'laptop';
    } else if (lowerMessage.match(/(tablet|ipad)/)) {
      deviceType = 'tablet';
    } else if (lowerMessage.match(/(watch|smartwatch)/)) {
      deviceType = 'smartwatch';
    } else if (lowerMessage.match(/(headphone|earphone|earbud|airpods)/)) {
      deviceType = 'headphones';
    }

    // Extract brand
    const brands = ['apple', 'samsung', 'google', 'xiaomi', 'mi', 'realme', 'redmi', 'poco', 'oppo', 'oneplus', 'dell', 'hp', 'asus', 'lenovo', 'motorola', 'msi', 'sony', 'nokia', 'lg'];
    for (const b of brands) {
      if (lowerMessage.includes(b)) {
        brand = b.charAt(0).toUpperCase() + b.slice(1);
        if (brand === 'Mi') brand = 'Xiaomi';
        break;
      }
    }

    // Check for gaming
    const isGaming = lowerMessage.includes('gaming') || lowerMessage.includes('game');

    let response = `Great! Let me help you find ${deviceType}s`;
    if (brand) response += ` from ${brand}`;
    if (isGaming) response += ` for gaming`;
    response += '. You can use the filters on the devices page to refine your search!';
    
    return {
      response: response,
      action: 'search',
      data: { category: deviceType, brand: brand, tags: isGaming ? ['gaming'] : [] },
      suggestions: [`View ${deviceType}s`, 'Apply filters', 'Get recommendations']
    };
  }

  // Recommendations
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggestion') || lowerMessage.includes('what should') || lowerMessage.includes('which')) {
    return {
      response: "I can recommend the perfect device for you! Have you completed our quiz? It helps me understand your needs better. Based on your preferences, I'll suggest the best devices for you.",
      action: 'recommend',
      suggestions: ['Take quiz', 'View recommendations', 'Browse all devices']
    };
  }

  // Compare devices
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs') || lowerMessage.includes('versus')) {
    return {
      response: "I can help you compare devices! Select the devices you want to compare from the device detail pages and I'll show you side-by-side differences in specifications, pricing, and features.",
      action: 'compare',
      suggestions: ['Browse devices', 'Find iPhone', 'Find Samsung']
    };
  }

  // Price related
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
    const priceMatch = lowerMessage.match(/\$?(\d+)/);
    const hasUnder = lowerMessage.includes('under') || lowerMessage.includes('below') || lowerMessage.includes('less');
    
    let response = "I can help you find devices within your budget! ";
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      response += `I'll search for devices ${hasUnder ? 'under' : 'around'} $${price.toLocaleString()}.`;
    } else {
      response += "What's your budget range?";
    }
    
    return {
      response: response,
      action: 'search',
      data: priceMatch && hasUnder ? { maxPrice: priceMatch[1] } : {},
      suggestions: ['Under $500', '$500-$1000', '$1000-$2000', 'Above $2000']
    };
  }

  // News
  if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('update')) {
    return {
      response: "I can show you the latest tech news! Check out the News section for the most recent updates, reviews, and announcements from the tech world.",
      action: 'navigate',
      data: { path: '/news' },
      suggestions: ['View tech news', 'Latest reviews', 'Browse devices']
    };
  }

  // Greeting
  if (lowerMessage.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/)) {
    return {
      response: "Hello! I'm Maverick, your tech assistant. How can I help you find the perfect device today?",
      suggestions: ['Find a phone', 'Browse laptops', 'Get recommendations', 'Latest tech news']
    };
  }

  // Thank you
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return {
      response: "You're welcome! Feel free to ask me anything else about devices or tech. I'm here to help!",
      suggestions: ['Find devices', 'Get recommendations', 'Tech news']
    };
  }

  // Default response with suggestions
  return {
    response: "I'm here to help! I can assist you with:\n\n🔍 Finding devices\n💰 Budget recommendations\n⭐ Personalized suggestions\n📊 Device comparisons\n📰 Latest tech news\n\nWhat would you like to know?",
    suggestions: ['Find devices', 'Get recommendations', 'Tech news', 'Help']
  };
};

// Chat endpoint
router.post('/', optional, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;

    const botResponse = await getChatbotResponse(message, userId);

    res.json({
      success: true,
      ...botResponse,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

