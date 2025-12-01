const express = require('express');
const router = express.Router();
const { optional } = require('../middleware/auth');
const Device = require('../models/Device');

// Intent Detection Patterns
const PATTERNS = {
  greetings: /^(hi|hello|hey|good morning|good evening|sup|what's up|yo)/i,

  search: {
    general: /(find|search|show|looking for|need|want|get me|recommend)/i,
    price: /under|below|less than|cheaper than|above|more than|between|around/i,
    gaming: /(gaming|game|pubg|cod|gamer)/i,
    camera: /(camera|photography|photo|selfie|video)/i,
    battery: /(battery|backup|charging|mah)/i,
    performance: /(fast|powerful|performance|processor|snapdragon|mediatek)/i,
    display: /(display|screen|amoled|oled|lcd|refresh rate|120hz|90hz)/i,
    budget: /(budget|affordable|cheap)/i,
    premium: /(premium|flagship|best|top|high end)/i
  },

  categories: {
    mobile: /(phone|mobile|smartphone)/i,
    laptop: /(laptop|notebook|macbook)/i,
    tablet: /(tablet|ipad)/i,
    smartwatch: /(smartwatch|watch|wearable)/i,
    headphone: /(headphone|earphone|earbud|airpod)/i,
    camera: /(camera|dslr|mirrorless)/i
  },

  brands: {
    apple: /(apple|iphone|ipad|macbook|airpod)/i,
    samsung: /(samsung|galaxy)/i,
    oneplus: /(oneplus|one plus)/i,
    xiaomi: /(xiaomi|redmi|poco|mi)/i,
    realme: /realme/i,
    vivo: /vivo/i,
    oppo: /oppo/i,
    asus: /asus/i,
    dell: /dell/i,
    hp: /hp/i,
    lenovo: /lenovo/i,
    sony: /sony/i,
    boat: /boat/i,
    jbl: /jbl/i
  },

  navigation: {
    home: /^(home|main|start)/i,
    devices: /(all devices|browse devices|device list)/i,
    news: /(news|latest news|tech news|articles)/i,
    compare: /(compare|comparison|vs)/i,
    community: /(community|forum|discussion)/i,
    recommendations: /(recommend|suggestion)/i
  },

  deviceSpecific: /(tell me about|specs of|details of|info about|what is|specifications)/i,

  help: /^(help|what can you do|features|how to use)/i,
  thanks: /(thank|thanks|appreciate)/i
};

// Extract price from message
const extractPrice = (message) => {
  const pricePatterns = {
    under: /(?:under|below|less than|cheaper than|max)\s*(?:rs\.?|₹)?\s*(\d+)k?/i,
    above: /(?:above|more than|over|minimum)\s*(?:rs\.?|₹)?\s*(\d+)k?/i,
    between: /between\s*(?:rs\.?|₹)?\s*(\d+)k?\s*(?:and|to|-)\s*(?:rs\.?|₹)?\s*(\d+)k?/i,
    exact: /(?:around|approximately|about)\s*(?:rs\.?|₹)?\s*(\d+)k?/i
  };

  // Between X and Y
  const betweenMatch = message.match(pricePatterns.between);
  if (betweenMatch) {
    const min = parseInt(betweenMatch[1]) * (betweenMatch[1].length <= 2 ? 1000 : 1);
    const max = parseInt(betweenMatch[2]) * (betweenMatch[2].length <= 2 ? 1000 : 1);
    return { minPrice: min, maxPrice: max };
  }

  // Under X
  const underMatch = message.match(pricePatterns.under);
  if (underMatch) {
    const price = parseInt(underMatch[1]) * (underMatch[1].length <= 2 ? 1000 : 1);
    return { maxPrice: price };
  }

  // Above X
  const aboveMatch = message.match(pricePatterns.above);
  if (aboveMatch) {
    const price = parseInt(aboveMatch[1]) * (aboveMatch[1].length <= 2 ? 1000 : 1);
    return { minPrice: price };
  }

  // Around X
  const exactMatch = message.match(pricePatterns.exact);
  if (exactMatch) {
    const price = parseInt(exactMatch[1]) * (exactMatch[1].length <= 2 ? 1000 : 1);
    return { minPrice: price * 0.9, maxPrice: price * 1.1 };
  }

  return {};
};

// Extract category from message
const extractCategory = (message) => {
  for (const [category, pattern] of Object.entries(PATTERNS.categories)) {
    if (pattern.test(message)) {
      return category;
    }
  }
  return null;
};

// Extract brand from message
const extractBrand = (message) => {
  for (const [brand, pattern] of Object.entries(PATTERNS.brands)) {
    if (pattern.test(message)) {
      return brand;
    }
  }
  return null;
};

// Build search query from message
const buildSearchQuery = (message) => {
  const keywords = [];

  if (PATTERNS.search.gaming.test(message)) keywords.push('gaming');
  if (PATTERNS.search.camera.test(message)) keywords.push('camera');
  if (PATTERNS.search.battery.test(message)) keywords.push('battery');
  if (PATTERNS.search.performance.test(message)) keywords.push('performance');
  if (PATTERNS.search.display.test(message)) keywords.push('display');

  return keywords.join(' ');
};

// Main Intent Processing Function
const processMessage = async (message) => {
  const msg = message.toLowerCase().trim();

  // 1. GREETINGS
  if (PATTERNS.greetings.test(msg)) {
    return {
      action: 'text',
      response: `Hey there! 👋 I'm **Maverick**, your tech buddy.\n\n` +
        `I can help you with:\n` +
        `• Finding devices (phones, laptops, etc.)\n` +
        `• Comparing gadgets\n` +
        `• Tech news and updates\n` +
        `• Answering tech questions\n\n` +
        `What are you looking for today?`
    };
  }

  // 2. HELP
  if (PATTERNS.help.test(msg)) {
    return {
      action: 'text',
      response: `**Here's what I can do:**\n\n` +
        `📱 **Search Devices**: "Show me gaming phones under 30k"\n` +
        `🔍 **Device Details**: "Tell me about iPhone 15"\n` +
        `📰 **News**: "Show me latest tech news"\n` +
        `⚖️ **Compare**: "Go to compare"\n` +
        `💬 **Questions**: "What is AMOLED?"\n\n` +
        `Just ask naturally!`
    };
  }

  // 3. THANKS
  if (PATTERNS.thanks.test(msg)) {
    return {
      action: 'text',
      response: `You're welcome! 😊 Let me know if you need anything else!`
    };
  }

  // 4. NAVIGATION
  for (const [page, pattern] of Object.entries(PATTERNS.navigation)) {
    if (pattern.test(msg)) {
      const pathMap = {
        home: '/',
        devices: '/devices',
        news: '/news',
        compare: '/compare',
        community: '/community',
        recommendations: '/recommendations'
      };
      return {
        action: 'navigate',
        path: pathMap[page],
        response: `Taking you to ${page}! 🚀`
      };
    }
  }

  // 5. DEVICE SPECIFIC QUERY
  if (PATTERNS.deviceSpecific.test(msg)) {
    // Extract device name (everything after the trigger phrase)
    const deviceName = msg
      .replace(/tell me about|specs of|details of|info about|what is|specifications/i, '')
      .trim();

    if (deviceName.length > 2) {
      return await handleDeviceDetails(deviceName);
    }
  }

  // 6. DEVICE SEARCH
  if (PATTERNS.search.general.test(msg) || PATTERNS.search.price.test(msg) || extractCategory(msg)) {
    const category = extractCategory(msg);
    const brand = extractBrand(msg);
    const prices = extractPrice(msg);
    const searchQuery = buildSearchQuery(msg);

    return await handleSearchDevices({
      category,
      brand,
      ...prices,
      searchQuery
    });
  }

  // 7. GENERAL TECH QUESTIONS
  const techAnswers = {
    'what is amoled': '**AMOLED** (Active Matrix Organic Light-Emitting Diode) is a display technology that offers deeper blacks, vibrant colors, and better power efficiency compared to LCD. Each pixel emits its own light! 🎨',
    'what is ram': '**RAM** (Random Access Memory) is your device\'s short-term memory. More RAM = better multitasking. For phones: 6-8GB is good, 12GB+ is great. For laptops: 8GB minimum, 16GB recommended. 💾',
    'what is processor': 'The **Processor** (CPU) is your device\'s brain. Popular ones:\n• Snapdragon (phones)\n• Apple A-series (iPhones)\n• Intel/AMD Ryzen (laptops)\n\nHigher numbers = better performance! 🧠',
    'what is refresh rate': '**Refresh Rate** (Hz) = how many times your screen updates per second.\n• 60Hz: Standard\n• 90Hz: Smooth\n• 120Hz+: Buttery smooth!\n\nHigher = smoother scrolling and gaming. ⚡',
    '5g': '**5G** is the latest mobile network technology, offering:\n• Faster internet speeds (up to 10Gbps)\n• Lower latency\n• Better connectivity\n\nMost new phones now support 5G! 📡',
    'fast charging': '**Fast Charging** technologies:\n• 18W: Basic fast charging\n• 33W-67W: Fast\n• 100W+: Super fast (0-100% in ~20 mins)\n\nCheck your charger wattage! ⚡'
  };

  for (const [key, answer] of Object.entries(techAnswers)) {
    if (msg.includes(key)) {
      return { action: 'text', response: answer };
    }
  }

  // 8. FALLBACK - Ask for clarification
  return {
    action: 'text',
    response: `I'm not quite sure what you're looking for. 🤔\n\n` +
      `Try asking like:\n` +
      `• "Show me gaming phones under 30000"\n` +
      `• "Tell me about iPhone 15"\n` +
      `• "Latest tech news"\n` +
      `• "What is AMOLED?"`
  };
};

// Tool Handler: Search Devices
const handleSearchDevices = async (params) => {
  try {
    const query = {};

    if (params.category) query.category = { $regex: params.category, $options: 'i' };
    if (params.brand) query.brand = { $regex: params.brand, $options: 'i' };

    if (params.maxPrice || params.minPrice) {
      query['prices.price'] = {};
      if (params.maxPrice) query['prices.price'].$lte = params.maxPrice;
      if (params.minPrice) query['prices.price'].$gte = params.minPrice;
    }

    if (params.searchQuery) {
      query.$or = [
        { name: { $regex: params.searchQuery, $options: 'i' } },
        { description: { $regex: params.searchQuery, $options: 'i' } },
        { tags: { $regex: params.searchQuery, $options: 'i' } }
      ];
    }

    const devices = await Device.find(query)
      .limit(10)
      .select('name brand image prices category averageRating')
      .sort({ averageRating: -1 });

    if (devices.length === 0) {
      return {
        action: 'text',
        response: `Hmm, I couldn't find any devices matching that. 😕\n\n` +
          `Try:\n` +
          `• Broadening your search\n` +
          `• Different price range\n` +
          `• Another brand or category`
      };
    }

    const categoryText = params.category ? ` ${params.category}s` : ' devices';
    const priceText = params.maxPrice ? ` under ₹${params.maxPrice}` : '';
    const brandText = params.brand ? ` from ${params.brand}` : '';

    return {
      action: 'render_devices',
      response: `Found **${devices.length}**${categoryText}${brandText}${priceText}! 🎯`,
      data: devices
    };

  } catch (error) {
    console.error("Search Error:", error);
    return {
      action: 'text',
      response: "Oops! Something went wrong while searching. Please try again. 🔧"
    };
  }
};

// Tool Handler: Device Details
const handleDeviceDetails = async (deviceName) => {
  try {
    const device = await Device.findOne({
      $or: [
        { name: { $regex: deviceName, $options: 'i' } },
        { model: { $regex: deviceName, $options: 'i' } },
        { brand: { $regex: deviceName, $options: 'i' } }
      ]
    });

    if (!device) {
      return {
        action: 'text',
        response: `I couldn't find a device called "${deviceName}". 😕\n\n` +
          `Could you check the spelling or try searching instead?`
      };
    }

    const price = device.prices?.[0]?.price ? `₹${device.prices[0].price.toLocaleString()}` : 'Price not available';
    const rating = device.averageRating ? `${device.averageRating}/5 ⭐` : 'Not rated yet';

    const summary = `**${device.name}**\n\n` +
      `💰 **Price**: ${price}\n` +
      `⭐ **Rating**: ${rating}\n` +
      `📱 **Category**: ${device.category}\n` +
      `🏢 **Brand**: ${device.brand}\n\n` +
      `Want to see full specifications?`;

    return {
      action: 'device_summary',
      response: summary,
      data: {
        deviceId: device._id,
        device: device
      }
    };

  } catch (error) {
    console.error("Device Details Error:", error);
    return {
      action: 'text',
      response: "Error fetching device details. Please try again. 🔧"
    };
  }
};

// Main Route
router.post('/', optional, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const result = await processMessage(message);

    res.json({
      success: true,
      ...result,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot Route Error:', error);
    res.status(500).json({
      success: false,
      action: 'text',
      response: "I'm having some technical difficulties. Please try again! 🔧"
    });
  }
});

module.exports = router;
