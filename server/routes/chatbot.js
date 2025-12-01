const express = require('express');
const router = express.Router();
const { protect, optional } = require('../middleware/auth');
const Device = require('../models/Device');
const News = require('../models/News');
const Groq = require('groq-sdk');

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// System Prompt for the LLM
const SYSTEM_PROMPT = `
You are Maverick, the intelligent AI assistant for PickMyTech.
Your goal is to help users find devices, navigate the app, and answer tech questions.

You have access to the following TOOLS. You must output your response in strict JSON format matching one of these structures:

1. **SEARCH_DEVICES**: Use this when the user is looking for specific devices (e.g., "gaming phones under 30k", "laptops with 16GB RAM").
   JSON Structure:
   {
     "tool": "search_devices",
     "parameters": {
       "category": "mobile" | "laptop" | "tablet" | "smartwatch" | "headphone" | "camera" | null,
       "brand": "string" | null,
       "maxPrice": number | null,
       "minPrice": number | null,
       "searchQuery": "string" (keywords like 'gaming', '5g', 'amoled')
     },
     "replyText": "Short friendly message introducing the results."
   }

2. **NAVIGATE**: Use this when the user wants to go to a specific section (e.g., "show me news", "go to compare", "home").
   JSON Structure:
   {
     "tool": "navigate",
     "parameters": {
       "path": "/devices" | "/news" | "/compare" | "/community" | "/recommendations" | "/"
     },
     "replyText": "Short confirmation message."
   }

3. **GENERAL_ANSWER**: Use this for general questions, greetings, or when no other tool fits (e.g., "hi", "what is this app?", "explain RAM").
   JSON Structure:
   {
     "tool": "general_answer",
     "replyText": "Your helpful answer here. Use Markdown for formatting (bold, bullet points)."
   }

4. **DEVICE_DETAILS**: Use this when the user asks about a specific device by name (e.g., "tell me about iPhone 15", "specs of Galaxy S24").
   JSON Structure:
   {
     "tool": "device_details",
     "parameters": {
       "deviceName": "string"
     },
     "replyText": "Let me pull up the details for that."
   }

**IMPORTANT RULES:**
- ALWAYS return valid JSON.
- Do not include markdown code blocks (like \`\`\`json) in the output, just the raw JSON string.
- Be concise and friendly.
- If the user's request is ambiguous, default to "general_answer" and ask for clarification.
`;

// Helper function to process LLM response
const processLLMResponse = async (userMessage) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      model: "llama3-70b-8192", // Using a stronger model for better JSON adherence
      temperature: 0.1, // Low temperature for deterministic output
      response_format: { type: "json_object" } // Enforce JSON mode if supported, otherwise prompt does it
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty response from LLM");

    // Parse JSON (handle potential markdown wrapping)
    let parsedData;
    try {
      const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      // Fallback if JSON parsing fails
      return {
        action: 'text',
        response: content // Return raw text if it's not JSON
      };
    }

    return await executeTool(parsedData);

  } catch (error) {
    console.error("LLM Error:", error);
    return {
      action: 'text',
      response: "I'm having a bit of trouble connecting to my brain right now. 🧠\nCould you try asking that again?"
    };
  }
};

// Execute the tool decided by LLM
const executeTool = async (toolData) => {
  const { tool, parameters, replyText } = toolData;

  switch (tool) {
    case 'search_devices':
      return await handleSearchDevices(parameters, replyText);
    case 'navigate':
      return {
        action: 'navigate',
        path: parameters.path,
        response: replyText
      };
    case 'device_details':
      return await handleDeviceDetails(parameters.deviceName);
    case 'general_answer':
    default:
      return {
        action: 'text',
        response: replyText
      };
  }
};

// Tool Handlers
const handleSearchDevices = async (params, replyText) => {
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
      // Combine text search with other filters
      query.$or = [
        { name: { $regex: params.searchQuery, $options: 'i' } },
        { description: { $regex: params.searchQuery, $options: 'i' } },
        { tags: { $regex: params.searchQuery, $options: 'i' } }
      ];
    }

    const devices = await Device.find(query).limit(5).select('name brand image prices category averageRating');

    if (devices.length === 0) {
      return {
        action: 'text',
        response: `I couldn't find any devices matching that criteria. 😕\nTry broadening your search (e.g., "phones under 50000").`
      };
    }

    return {
      action: 'render_devices',
      response: replyText || `Found ${devices.length} devices for you!`,
      data: devices
    };

  } catch (error) {
    console.error("Search Error:", error);
    return { action: 'text', response: "Sorry, I encountered an error while searching for devices." };
  }
};

const handleDeviceDetails = async (deviceName) => {
  try {
    const device = await Device.findOne({
      $or: [
        { name: { $regex: deviceName, $options: 'i' } },
        { model: { $regex: deviceName, $options: 'i' } }
      ]
    });

    if (!device) {
      return {
        action: 'text',
        response: `I couldn't find a device named "${deviceName}". Could you check the spelling?`
      };
    }

    // Return a special "device_card" action or just navigate
    // For now, let's return a summary and a suggestion to view full details
    const price = device.prices?.[0]?.price ? `₹${device.prices[0].price}` : 'N/A';

    const summary = `**${device.name}**\n` +
      `- Price: ${price}\n` +
      `- Rating: ${device.averageRating || 'N/A'} ⭐\n` +
      `- Category: ${device.category}\n\n` +
      `Would you like to see full specs?`;

    return {
      action: 'suggestion', // Or a custom 'device_summary'
      response: summary,
      suggestions: ['View Full Details', 'Compare'],
      data: { deviceId: device._id }
    };

  } catch (error) {
    console.error("Device Details Error:", error);
    return { action: 'text', response: "Error fetching device details." };
  }
};


// Main Route
router.post('/', optional, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const result = await processLLMResponse(message);

    res.json({
      success: true,
      ...result,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot Route Error:', error);
    res.status(500).json({
      success: false,
      response: "I'm having some internal issues. Please try again later."
    });
  }
});

module.exports = router;
