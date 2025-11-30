const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { optional } = require('../middleware/auth');

// Get all devices with filters
router.get('/', optional, async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query['prices.price'] = {};
      if (minPrice) query['prices.price'].$gte = Number(minPrice);
      if (maxPrice) query['prices.price'].$lte = Number(maxPrice);
    }

    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    console.log('Executing Device query:', JSON.stringify(query));
    console.log('Sort options:', JSON.stringify(sortOptions));

    const devices = await Device.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    console.log(`Found ${devices.length} devices`);

    const total = await Device.countDocuments(query);

    res.json({
      success: true,
      devices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get device by ID
router.get('/:id', optional, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }
    res.json({
      success: true,
      device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get brands
router.get('/brands/list', async (req, res) => {
  try {
    const brands = await Device.distinct('brand');
    res.json({
      success: true,
      brands: brands.sort()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Device.distinct('category');
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Compare devices
router.post('/compare', async (req, res) => {
  try {
    const { deviceIds } = req.body;
    const devices = await Device.find({ _id: { $in: deviceIds } });
    res.json({
      success: true,
      devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

