const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const Device = require('../models/Device');
const News = require('../models/News');
const Community = require('../models/Community');

// Enhanced rule-based chatbot
const Groq = require('groq-sdk');

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
      response: "I'm Maverick, your AI assistant for PickMyTech! 🚀\n\nThis platform helps you:\n- **Find the best gadgets** based on your needs\n- **Compare devices** side-by-side\n- **Read the latest tech news**\n- **Join community discussions**\n\nHow can I help you today?",
      suggestions: ['Find a phone', 'Latest news', 'Compare devices']
    };
  }

  // 3. Specific Device Details (Enhanced)
  if (lowerMessage.includes('specs of') || lowerMessage.includes('details of') || lowerMessage.includes('tell me about') || lowerMessage.includes('price of')) {
    // Extract potential device name
    const searchTerms = lowerMessage.replace('specs of', '').replace('details of', '').replace('tell me about', '').replace('price of', '').trim();

    if (searchTerms.length > 2) {
      try {
        // Try to find a matching device
        const device = await Device.findOne({
          $or: [
            { name: { $regex: searchTerms, $options: 'i' } },
            { model: { $regex: searchTerms, $options: 'i' } }
          ]
        });

        if (device) {
          const specs = device.specifications;
          const price = device.prices && device.prices.length > 0 ? device.prices[0].price : 'N/A';

          let responseText = `Here are the details for **${device.name}**:\n\n`;
          responseText += `- **Price**: ₹${price}\n`;
          if (specs.processor?.name) responseText += `- **Processor**: ${specs.processor.name}\n`;
          if (specs.memory?.ram) responseText += `- **RAM**: ${specs.memory.ram}\n`;
          if (specs.memory?.storage) responseText += `- **Storage**: ${specs.memory.storage}\n`;
          if (specs.display?.size) responseText += `- **Display**: ${specs.display.size} ${specs.display.type}\n`;
          if (specs.battery?.capacity) responseText += `- **Battery**: ${specs.battery.capacity}\n`;

          return {
            action: 'navigate',
            path: `/devices/${device._id}`,
            response: responseText + "\nWould you like to see the full details?",
            suggestions: ['Yes, show full details', 'Compare this device', 'Find other phones']
          };
        }
      } catch (err) {
        console.error("Device search error:", err);
      }
    }
  }

  // 4. Smart Device Search (Category + Budget + Brand)
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
    const brands = ['apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'xiaomi', 'oneplus', 'google', 'sony', 'nothing', 'realme', 'vivo', 'oppo'];
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

  // 8. LLM Fallback (Groq)
  try {
    if (process.env.GROQ_API_KEY) {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are Maverick, a helpful tech assistant for PickMyTech. 
            
            Your capabilities:
            1. Help users find devices (phones, laptops, etc.).
            2. Explain technical specifications.
            3. Guide users to sections: 
               - /devices (Browse)
               - /compare (Compare)
               - /news (Tech News)
               - /community (Discussions)
               - /recommendations (AI Help)
            
            Keep answers concise, friendly, and use markdown for formatting (bold, lists).
            If a user asks for specific device details you don't know, suggest they search for it.`
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 300,
      });

      const text = completion.choices[0]?.message?.content;

      if (text) {
        return {
          response: text.trim(),
          suggestions: ['Ask another question', 'Find devices', 'Home']
        };
      }
    }
  } catch (error) {
    console.error('Groq Error:', error.message);
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
