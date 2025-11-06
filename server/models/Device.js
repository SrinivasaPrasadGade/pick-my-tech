const mongoose = require('mongoose');

const displaySchema = new mongoose.Schema({
  size: { type: String, default: '' },
  resolution: { type: String, default: '' },
  type: { type: String, default: '' },
  refreshRate: { type: String, default: '' },
  features: { type: [String], default: [] }
}, { _id: false });

const processorSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  cores: { type: Number, default: 0 },
  speed: { type: String, default: '' },
  architecture: { type: String, default: '' }
}, { _id: false });

const memorySchema = new mongoose.Schema({
  ram: { type: String, default: '' },
  storage: { type: String, default: '' },
  expandable: { type: Boolean, default: false }
}, { _id: false });

const cameraSchema = new mongoose.Schema({
  rear: { type: String, default: '' },
  front: { type: String, default: '' },
  video: { type: String, default: '' },
  features: { type: [String], default: [] }
}, { _id: false });

const batterySchema = new mongoose.Schema({
  capacity: { type: String, default: '' },
  fastCharge: { type: Boolean, default: false },
  wirelessCharge: { type: Boolean, default: false }
}, { _id: false });

const connectivitySchema = new mongoose.Schema({
  wifi: { type: String, default: '' },
  bluetooth: { type: String, default: '' },
  ports: { type: [String], default: [] },
  cellular: { type: [String], default: [] }
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
  length: { type: String, default: '' },
  width: { type: String, default: '' },
  height: { type: String, default: '' },
  weight: { type: String, default: '' }
}, { _id: false });

const specificationSchema = new mongoose.Schema({
  display: { type: displaySchema, default: () => ({}) },
  processor: { type: processorSchema, default: () => ({}) },
  memory: { type: memorySchema, default: () => ({}) },
  camera: { type: cameraSchema, default: () => ({}) },
  battery: { type: batterySchema, default: () => ({}) },
  connectivity: { type: connectivitySchema, default: () => ({}) },
  operatingSystem: { type: String, default: '' },
  dimensions: { type: dimensionsSchema, default: () => ({}) },
  additionalFeatures: { type: [String], default: [] }
}, { _id: false });

const priceSchema = new mongoose.Schema({
  source: String,
  url: String,
  price: Number,
  currency: String,
  lastUpdated: Date
});

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['mobile', 'laptop', 'tablet', 'smartwatch', 'headphones', 'camera', 'other'],
    required: true,
    index: true
  },
  model: String,
  image: String,
  images: [String],
  description: String,
  specifications: specificationSchema,
  prices: [priceSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [String],
  releaseDate: Date,
  inStock: {
    type: Boolean,
    default: true
  },
  featureExplanations: {
    type: Map,
    of: {
      title: String,
      description: String,
      link: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

deviceSchema.index({ name: 'text', brand: 'text', description: 'text' });
deviceSchema.index({ category: 1, brand: 1 });

module.exports = mongoose.model('Device', deviceSchema);

