const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github', 'facebook'],
    default: 'local'
  },
  providerId: String,
  quizCompleted: {
    type: Boolean,
    default: false
  },
  quizAnswers: {
    type: Object,
    default: {} // Flexible schema for new quiz structure
  },
  preferences: {
    favoriteDevices: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    }],
    savedSearches: [{
      filters: Object,
      createdAt: Date
    }]
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

