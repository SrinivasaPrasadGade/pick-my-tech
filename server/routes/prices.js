const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const axios = require('axios');

// Update prices for a device (to be called by cron job)
router.post('/update/:deviceId', async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Placeholder for e-commerce API integration
    // This would fetch real prices from Amazon, Best Buy, etc.
    const mockPrices = [
      {
        source: 'Amazon',
        url: `https://amazon.com/search?q=${encodeURIComponent(device.name)}`,
        price: Math.floor(Math.random() * 2000) + 300,
        currency: 'USD',
        lastUpdated: new Date()
      },
      {
        source: 'Best Buy',
        url: `https://bestbuy.com/search?q=${encodeURIComponent(device.name)}`,
        price: Math.floor(Math.random() * 2000) + 300,
        currency: 'USD',
        lastUpdated: new Date()
      }
    ];

    device.prices = mockPrices;
    await device.save();

    res.json({
      success: true,
      prices: device.prices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get best prices for a device
router.get('/device/:deviceId', async (req, res) => {
  try {
    const device = await Device.findById(req.params.deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    const sortedPrices = [...device.prices].sort((a, b) => a.price - b.price);

    res.json({
      success: true,
      prices: device.prices,
      bestPrice: sortedPrices[0] || null,
      averagePrice: device.prices.reduce((sum, p) => sum + p.price, 0) / device.prices.length || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

