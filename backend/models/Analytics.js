const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Date for daily analytics
  date: {
    type: Date,
    required: true,
    unique: true
  },
  
  // Daily mood data
  dailyMood: {
    type: String,
    enum: ['😊', '😢', '😡', '😴', '🤔', '😌', '🥰', '😤', '😔', '✨', '🌱', '🌟', '🦋', '🕊️', '🌿']
  },
  
  moodScore: {
    type: Number,
    min: 1,
    max: 10
  },
  
  // Entry statistics
  entriesCount: {
    type: Number,
    default: 0
  },
  
  totalWordCount: {
    type: Number,
    default: 0
  },
  
  averageWordCount: {
    type: Number,
    default: 0
  },
  
  // Writing patterns
  mostUsedWords: [{
    word: String,
    count: Number
  }],
  
  // Entry types used
  entryTypes: [{
    type: String,
    count: Number
  }],
  
  // Time-based data
  writingTime: {
    type: String, // e.g., "morning", "afternoon", "evening", "night"
    enum: ['morning', 'afternoon', 'evening', 'night']
  },
  
  // Streak data
  currentStreak: {
    type: Number,
    default: 0
  },
  
  longestStreak: {
    type: Number,
    default: 0
  },
  
  // Weekly/Monthly aggregations
  weekNumber: {
    type: Number
  },
  
  month: {
    type: Number
  },
  
  year: {
    type: Number
  },
  
  // Growth indicators
  growthThemes: [{
    theme: String,
    frequency: Number
  }],
  
  // Emotional patterns
  emotionalPattern: {
    type: String,
    enum: ['positive', 'neutral', 'negative', 'mixed']
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ weekNumber: 1, year: 1 });
analyticsSchema.index({ month: 1, year: 1 });
analyticsSchema.index({ currentStreak: -1 });

// Pre-save middleware to calculate derived fields
analyticsSchema.pre('save', function(next) {
  if (this.date) {
    const dateObj = new Date(this.date);
    this.weekNumber = this.getWeekNumber(dateObj);
    this.month = dateObj.getMonth() + 1;
    this.year = dateObj.getFullYear();
  }
  
  if (this.totalWordCount > 0 && this.entriesCount > 0) {
    this.averageWordCount = Math.round(this.totalWordCount / this.entriesCount);
  }
  
  this.updatedAt = new Date();
  next();
});

// Method to get week number
analyticsSchema.methods.getWeekNumber = function(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};

// Method to update streak
analyticsSchema.methods.updateStreak = function() {
  // This would be called when a new entry is created
  // Logic to calculate current streak based on consecutive days with entries
  return this;
};

// Static method to get mood timeline
analyticsSchema.statics.getMoodTimeline = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    date: { $gte: startDate }
  }).sort({ date: 1 });
};

// Static method to get streak data
analyticsSchema.statics.getStreakData = function() {
  return this.findOne().sort({ date: -1 }).select('currentStreak longestStreak');
};

// Static method to get weekly summary
analyticsSchema.statics.getWeeklySummary = function(weekNumber, year) {
  return this.find({
    weekNumber: weekNumber,
    year: year
  }).sort({ date: 1 });
};

// Static method to get monthly summary
analyticsSchema.statics.getMonthlySummary = function(month, year) {
  return this.find({
    month: month,
    year: year
  }).sort({ date: 1 });
};

module.exports = mongoose.model('Analytics', analyticsSchema);
