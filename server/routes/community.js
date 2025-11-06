const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const { protect, optional } = require('../middleware/auth');

// Get all posts
router.get('/', optional, async (req, res) => {
  try {
    const {
      category,
      device,
      page = 1,
      limit = 20,
      sort = 'createdAt'
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (device) query.device = device;

    const sortOptions = { [sort]: -1 };

    const posts = await Community.find(query)
      .populate('user', 'name email avatar')
      .populate('device', 'name brand image')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Community.countDocuments(query);

    res.json({
      success: true,
      posts,
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

// Get single post
router.get('/:id', optional, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate('device', 'name brand image');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create post
router.post('/', protect, async (req, res) => {
  try {
    const post = await Community.create({
      ...req.body,
      user: req.user._id
    });

    await post.populate('user', 'name email avatar');
    await post.populate('device', 'name brand image');

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add comment
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user._id,
      content: req.body.content
    });

    await post.save();
    await post.populate('comments.user', 'name email avatar');

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Like/Unlike post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const index = post.likes.indexOf(req.user._id);
    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      liked: index === -1,
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

