const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const Device = require('../models/Device');
const News = require('../models/News');
const Community = require('../models/Community');

// Enhanced rule-based chatbot
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Enhanced rule-based chatbot
const getChatbotResponse = async (message, userId) => {
  const lowerMessage = message.toLowerCase();

  // 1. Navigation Commands
  if (lowerMessage.includes('go to') || lowerMessage.includes('navigate to') || lowerMessage.includes('open')) {
    if (lowerMessage.includes('home')) return { action: 'navigate', path: '/', response: "Taking you to the home page." };
    if (lowerMessage.includes('device') || lowerMessage.includes('phone') || lowerMessage.includes('laptop')) return { action: 'navigate', path: '/devices', response: "Here are the devices." };
    if (lowerMessage.includes('news')) return { action: 'navigate', path: '/news', response: "Opening tech news." };
    if (lowerMessage.includes('community') || lowerMessage.includes('forum')) return { action: 'navigate', path: '/community', response: "Going to the community section." };
    if (lowerMessage.includes('compare')) return { action: 'navigate', path: '/compare', response: "Opening comparison tool." };
    if (lowerMessage.includes('recommend')) return { action: 'navigate', path: '/recommendations', response: "Let's find some recommendations." };
  }

  // 2. Website Information
  if (lowerMessage.includes('what is this website') || lowerMessage.includes('about this app') || lowerMessage.includes('who are you')) {
    return {
      response: "I'm Maverick, your AI assistant for PickMyTech! 🚀\n\nThis platform helps you:\n- Find the best gadgets based on your needs\n- Compare devices side-by-side\n- Read the latest tech news\n- Join community discussions\n\nHow can I help you today?",
      suggestions: ['Find a phone', 'Latest news', 'Compare devices']
    };
  }

  // 3. Smart Device Search (Category + Budget + Brand)
  if (lowerMessage.includes('find') || lowerMessage.includes('show') || lowerMessage.includes('search') || lowerMessage.includes('looking for') || lowerMessage.includes('recommend') || lowerMessage.includes('buy')) {
    let category = '';
    if (lowerMessage.includes('phone') || lowerMessage.includes('mobile')) category = 'mobile';
    if (lowerMessage.includes('laptop')) category = 'laptop';
    if (lowerMessage.includes('tablet')) category = 'tablet';
    if (lowerMessage.includes('watch')) category = 'smartwatch';
    if (lowerMessage.includes('headphone') || lowerMessage.includes('earbud')) category = 'headphone';

    // Extract budget if present (e.g., "under 50000")
    const budgetMatch = lowerMessage.match(/under\s+(\d+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    // Extract brand if present
    const brands = ['apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'xiaomi', 'oneplus', 'google', 'sony'];
    const brand = brands.find(b => lowerMessage.includes(b));

    let queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (budget) queryParams.append('maxPrice', budget);
    if (brand) queryParams.append('brand', brand);

    // If no specific criteria found but intent is search, default to devices page
    if (!category && !budget && !brand) {
      return {
        response: "Sure! I can help you find devices. What are you looking for? (e.g., 'Find gaming laptops' or 'Show Samsung phones')",
        suggestions: ['Find phones', 'Find laptops', 'Best tablets']
      };
    }

    return {
      action: 'navigate',
      path: `/devices?${queryParams.toString()}`,
      response: `Here are some ${brand || ''} ${category || 'devices'} ${budget ? 'under ₹' + budget : ''} for you!`
    };
  }

  // 4. Specific Device Details
  if (lowerMessage.includes('specs') || lowerMessage.includes('details') || lowerMessage.includes('price of')) {
    // This would ideally require a search to get the ID, for now redirect to search
    return {
      action: 'navigate',
      path: '/devices',
      response: "Please search for the device in the devices section to see full details.",
      suggestions: ['Go to Devices']
    };
  }

  // 5. News & Updates
  if (lowerMessage.includes('news') || lowerMessage.includes('update') || lowerMessage.includes('latest')) {
    try {
      const latestNews = await News.find().sort({ publishedAt: -1 }).limit(3);
      if (latestNews.length > 0) {
        const newsLinks = latestNews.map(n => `- [${n.title}](/news)`);
        return {
          response: "Here are the latest tech headlines:\n" + newsLinks.join('\n'),
          suggestions: ['Read more news', 'Home']
        };
      }
    } catch (err) {
      console.error('News fetch error:', err);
    }
    return { action: 'navigate', path: '/news', response: "Checking the latest tech news for you..." };
  }

  // 6. Comparison
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference')) {
    return {
      action: 'navigate',
      path: '/compare',
      response: "You can compare up to 3 devices side-by-side in our comparison tool.",
      suggestions: ['Go to Compare']
    };
  }

  // 7. Greetings & Small Talk
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      response: "Hello! 👋 I'm Maverick. I can help you find the perfect gadget, compare specs, or catch up on tech news. How can I help you today?",
      suggestions: ['Find a phone', 'Suggest a laptop', 'Latest news']
    };
  }

  if (lowerMessage.includes('thank')) {
    return {
      response: "You're welcome! Happy to help. 😊",
      suggestions: ['Find more devices', 'Home']
    };
  }

  // 8. LLM Fallback (Google Gemini)
  try {
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are Maverick, a helpful tech assistant for PickMyTech. Answer the following question concisely and helpfully.\n\nQuestion: ${message}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      if (text) {
        return {
          response: text.trim(),
          suggestions: ['Ask another question', 'Find devices', 'Home']
        };
      }
    }
  } catch (error) {
    console.error('Gemini Error:', error.message);
    // Fall through to default response
  }

  // Default Fallback
  return {
    response: "I'm not sure I understood that completely. 🤔\n\nTry asking me to:\n- 'Find laptops under $1000'\n- 'Tell me about iPhone 15'\n- 'Show latest news'\n- 'Compare devices'",
    suggestions: ['Find devices', 'Help', 'Latest news']
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
    console.error('Chatbot Error:', error);
    res.status(500).json({
      success: false,
      message: "I'm having a little trouble connecting right now. Please try again!"
    });
  }
});

module.exports = router;
