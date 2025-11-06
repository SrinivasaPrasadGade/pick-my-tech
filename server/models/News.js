const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  content: String,
  url: String,
  imageUrl: String,
  source: String,
  author: String,
  publishedAt: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['mobile', 'laptop', 'tablet', 'smartwatch', 'general', 'reviews', 'rumors'],
    default: 'general'
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1, publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);

