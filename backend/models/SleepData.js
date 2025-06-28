const mongoose = require('mongoose');

const sleepDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    maxlength: [32, 'Username cannot exceed 32 characters']
  },
  change: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length <= 10; // Max 10 changes
      },
      message: 'Change array cannot exceed 10 items'
    }
  },
  sleepStruggle: {
    min: {
      type: Number,
      enum: [0, 2, 8],
      default: 0,
      required: [true, 'Sleep struggle minimum is required']
    },
    max: {
      type: Number,
      enum: [2, 8, 10],
      default: 2,
      required: [true, 'Sleep struggle maximum is required']
    }
  },
  bedTime: {
    type: String,
    required: [true, 'Bed time is required'],
    match: [
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time in HH:MM format'
    ]
  },
  wakeTime: {
    type: String,
    required: [true, 'Wake time is required'],
    match: [
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      'Please enter a valid time in HH:MM format'
    ]
  },
  sleepDuration: {
    type: Number,
    required: [true, 'Sleep duration is required'],
    min: [0, 'Sleep duration cannot be negative'],
    max: [24, 'Sleep duration cannot exceed 24 hours']
  },
  sleepQuality: {
    type: Number,
    min: [1, 'Sleep quality must be at least 1'],
    max: [10, 'Sleep quality cannot exceed 10'],
    default: 5
  },
  sleepEfficiency: {
    type: Number,
    min: [0, 'Sleep efficiency cannot be negative'],
    max: [100, 'Sleep efficiency cannot exceed 100%'],
    default: 0
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length <= 5; // Max 5 tags
      },
      message: 'Tags array cannot exceed 5 items'
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculated sleep duration in hours
sleepDataSchema.virtual('calculatedDuration').get(function() {
  if (!this.bedTime || !this.wakeTime) return null;
  
  const bedTime = new Date(`2000-01-01T${this.bedTime}:00`);
  let wakeTime = new Date(`2000-01-01T${this.wakeTime}:00`);
  
  // If wake time is before bed time, it means next day
  if (wakeTime <= bedTime) {
    wakeTime.setDate(wakeTime.getDate() + 1);
  }
  
  const durationMs = wakeTime - bedTime;
  return Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
});

// Virtual for sleep quality description
sleepDataSchema.virtual('qualityDescription').get(function() {
  if (this.sleepQuality >= 8) return 'Excellent';
  if (this.sleepQuality >= 6) return 'Good';
  if (this.sleepQuality >= 4) return 'Fair';
  return 'Poor';
});

// Indexes for better query performance
sleepDataSchema.index({ user: 1, createdAt: -1 });
sleepDataSchema.index({ username: 1 });
sleepDataSchema.index({ createdAt: -1 });
sleepDataSchema.index({ sleepQuality: -1 });

// Pre-save middleware to validate sleep times
sleepDataSchema.pre('save', function(next) {
  // Validate that sleep struggle min is less than max
  if (this.sleepStruggle.min >= this.sleepStruggle.max) {
    return next(new Error('Sleep struggle minimum must be less than maximum'));
  }
  
  // Validate sleep duration is reasonable
  if (this.sleepDuration < 0 || this.sleepDuration > 24) {
    return next(new Error('Sleep duration must be between 0 and 24 hours'));
  }
  
  next();
});

// Static method to get sleep statistics for a user
sleepDataSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        avgSleepDuration: { $avg: '$sleepDuration' },
        avgSleepQuality: { $avg: '$sleepQuality' },
        avgSleepEfficiency: { $avg: '$sleepEfficiency' },
        minSleepDuration: { $min: '$sleepDuration' },
        maxSleepDuration: { $max: '$sleepDuration' },
        bestSleepQuality: { $max: '$sleepQuality' },
        worstSleepQuality: { $min: '$sleepQuality' }
      }
    }
  ]);
  
  return stats[0] || null;
};

// Static method to get recent sleep data
sleepDataSchema.statics.getRecentData = function(userId, limit = 7) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'displayName email');
};

// Method to get formatted sleep data
sleepDataSchema.methods.getFormattedData = function() {
  return {
    id: this._id,
    username: this.username,
    change: this.change,
    sleepStruggle: this.sleepStruggle,
    bedTime: this.bedTime,
    wakeTime: this.wakeTime,
    sleepDuration: this.sleepDuration,
    sleepQuality: this.sleepQuality,
    sleepEfficiency: this.sleepEfficiency,
    calculatedDuration: this.calculatedDuration,
    qualityDescription: this.qualityDescription,
    notes: this.notes,
    tags: this.tags,
    isPublic: this.isPublic,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('SleepData', sleepDataSchema); 