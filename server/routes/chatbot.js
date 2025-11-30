const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const Device = require('../models/Device');
const News = require('../models/News');
const Community = require('../models/Community');

// Enhanced rule-based chatbot
const getChatbotResponse = async (message, userId) => {
  const lowerMessage = message.toLowerCase().trim();

  // 1. Navigation & Help
  if (lowerMessage.includes('help') || lowerMessage === '?' || lowerMessage === 'menu') {
    return {
      response: "I'm Maverick, your AI tech assistant! 🤖\n\nI can help you with:\n📱 **Finding Devices**: 'Show me gaming phones under $800'\n🆚 **Comparisons**: 'Compare iPhone 15 and Samsung S24'\n📰 **Tech News**: 'Latest tech news'\n⭐ **Recommendations**: 'Suggest a laptop for coding'\n🔍 **Specific Details**: 'Tell me about Pixel 8 Pro'\n\nWhat's on your mind?",
      suggestions: ['Find gaming phones', 'Compare devices', 'Latest news', 'Suggest a laptop']
    };
  }

  // 2. Compare Devices (Smart Comparison)
  if (lowerMessage.includes('compare') || lowerMessage.includes('vs') || lowerMessage.includes('versus')) {
    // Try to extract two device names
    const parts = lowerMessage.split(/compare|vs|versus|and/i).filter(p => p.trim().length > 2);

    if (parts.length >= 2) {
      // This is a placeholder for a more complex extraction, simplified for now
      // In a real app, we'd use NLP or more robust regex
      return {
        response: "I can help you compare those! To see a detailed side-by-side comparison of specifications, features, and pricing, please use our dedicated Comparison tool.",
        action: 'navigate',
        data: { path: '/compare' },
        suggestions: ['Go to Compare', 'Find phones', 'Help']
      };
    }

    return {
      response: "I can help you compare devices! 🆚\n\nGo to the **Compare Page** to select up to 3 devices and see their specs side-by-side. You can also ask me specific questions like 'Is iPhone 15 better than S24?'.",
      action: 'navigate',
      data: { path: '/compare' },
      suggestions: ['Go to Compare', 'Best camera phone', 'Battery life leaders']
    };
  }

  // 3. Specific Device Details (Enhanced)
  if (lowerMessage.includes('tell me about') || lowerMessage.includes('specs of') || lowerMessage.includes('details of') || lowerMessage.includes('info on')) {
    const deviceName = lowerMessage.replace(/tell me about|specs of|details of|info on/gi, '').trim();
    if (deviceName.length > 1) {
      try {
        const device = await Device.findOne({
          name: { $regex: deviceName, $options: 'i' }
        });

        if (device) {
          const price = device.prices && device.prices.length > 0
            ? `$${Math.min(...device.prices.map(p => p.price)).toLocaleString()}`
            : 'Price unavailable';

          const specs = device.specifications || {};
          const processor = specs.processor?.name || 'N/A';
          const ram = specs.memory?.ram || 'N/A';
          const battery = specs.battery?.capacity || 'N/A';

          return {
            response: `📱 **${device.name}**\n\n${device.description.substring(0, 150)}...\n\n**Key Specs:**\n⚙️ Processor: ${processor}\n💾 RAM: ${ram}\n🔋 Battery: ${battery}\n💰 Starting at: ${price}\n\nWould you like to see the full details?`,
            action: 'navigate',
            data: { path: `/devices/${device._id}` },
            suggestions: ['View full details', 'Compare this', 'Find similar']
          };
        }
      } catch (error) {
        console.error('Error finding device:', error);
      }
    }
  }

  // 4. Tech News (Database Integrated)
  if (lowerMessage.includes('news') || lowerMessage.includes('latest') || lowerMessage.includes('headlines')) {
    try {
      const news = await News.find().sort({ publishedAt: -1 }).limit(3);
      if (news.length > 0) {
        const newsList = news.map(n => `📰 **${n.title}**`).join('\n');
        return {
          response: `Here are the latest tech headlines:\n\n${newsList}\n\nCheck out the News section for more!`,
          action: 'navigate',
          data: { path: '/news' },
          suggestions: ['Read more news', 'Find devices', 'Home']
        };
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }

    return {
      response: "I can show you the latest tech news! Check out our News section for updates.",
      action: 'navigate',
      data: { path: '/news' },
      suggestions: ['Go to News', 'Home']
    };
  }

  // 5. Community/Discussions
  if (lowerMessage.includes('community') || lowerMessage.includes('discussion') || lowerMessage.includes('forum') || lowerMessage.includes('people say')) {
    return {
      response: "Join the conversation! 🗣️\n\nOur Community is buzzing with discussions. You can read reviews, ask questions, and share your tech setup.",
      action: 'navigate',
      data: { path: '/community' },
      suggestions: ['Go to Community', 'Write a post', 'Home']
    };
  }

  // 6. Smart Device Search (Category + Budget + Brand)
  if (lowerMessage.includes('find') || lowerMessage.includes('show') || lowerMessage.includes('search') || lowerMessage.includes('looking for') || lowerMessage.includes('recommend')) {
    let category = 'mobile';
    let brand = null;
    let maxPrice = null;

    // Detect Category
    if (lowerMessage.match(/laptop|notebook|macbook/)) category = 'laptop';
    else if (lowerMessage.match(/tablet|ipad/)) category = 'tablet';
    else if (lowerMessage.match(/watch|smartwatch/)) category = 'smartwatch';
    else if (lowerMessage.match(/headphone|earbud|airpod/)) category = 'headphones';
    else if (lowerMessage.match(/camera|dslr/)) category = 'camera';

    // Detect Brand
    const brands = ['apple', 'samsung', 'google', 'dell', 'hp', 'lenovo', 'asus', 'sony', 'nothing', 'xiaomi', 'oneplus'];
    for (const b of brands) {
      if (lowerMessage.includes(b)) {
        brand = b.charAt(0).toUpperCase() + b.slice(1);
        break;
      }
    }

    // Detect Price (e.g., "under 1000", "below $500")
    const priceMatch = lowerMessage.match(/(?:under|below|less than)\s?\$?(\d+)/);
    if (priceMatch) {
      maxPrice = parseInt(priceMatch[1]);
    }

    let responseText = `I've set up a search for **${category}s**`;
    if (brand) responseText += ` by **${brand}**`;
    if (maxPrice) responseText += ` under **$${maxPrice}**`;
    responseText += ". Here's what I found!";

    return {
      response: responseText,
      action: 'search',
      data: { category, brand, maxPrice },
      suggestions: [`Show ${category}s`, 'Refine search', 'Home']
    };
  }

  // 7. Greetings & Small Talk
  if (lowerMessage.match(/^(hi|hello|hey|yo|greetings)/)) {
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

