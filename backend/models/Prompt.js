const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
  // Prompt content
  question: {
    type: String,
    required: true,
    maxlength: 500
  },
  
  // Prompt category
  category: {
    type: String,
    enum: [
      'reflection',
      'gratitude', 
      'goals',
      'emotions',
      'creativity',
      'relationships',
      'growth',
      'mindfulness',
      'daily-life',
      'future'
    ],
    required: true
  },
  
  // Prompt difficulty level
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // Target audience
  targetAudience: {
    type: String,
    enum: ['all', 'beginners', 'experienced', 'specific-topics'],
    default: 'all'
  },
  
  // Prompt metadata
  title: {
    type: String,
    maxlength: 100,
    required: true
  },
  
  description: {
    type: String,
    maxlength: 200
  },
  
  // Usage tracking
  usageCount: {
    type: Number,
    default: 0
  },
  
  lastUsed: {
    type: Date
  },
  
  // Prompt status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Priority for selection (higher = more likely to be selected)
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  
  // Tags for better categorization
  tags: [{
    type: String,
    maxlength: 50
  }],
  
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

// Indexes for better query performance
promptSchema.index({ category: 1, isActive: 1 });
promptSchema.index({ difficulty: 1 });
promptSchema.index({ priority: -1 });
promptSchema.index({ lastUsed: -1 });
promptSchema.index({ usageCount: -1 });

// Pre-save middleware
promptSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to increment usage
promptSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Static method to get random prompt by category
promptSchema.statics.getRandomPrompt = function(category = null, difficulty = null) {
  const query = { isActive: true };
  
  if (category) {
    query.category = category;
  }
  
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: 1 } }
  ]);
};

// Static method to get prompts by preferences
promptSchema.statics.getPromptsByPreferences = function(preferences) {
  const query = { isActive: true };
  
  if (preferences.topics && preferences.topics.length > 0) {
    query.category = { $in: preferences.topics };
  }
  
  if (preferences.experience) {
    const difficultyMap = {
      'Beginner': 'beginner',
      'Sometimes': 'intermediate', 
      'Regular': 'advanced'
    };
    query.difficulty = difficultyMap[preferences.experience] || 'beginner';
  }
  
  return this.find(query).sort({ priority: -1, usageCount: 1 });
};

module.exports = mongoose.model('Prompt', promptSchema);
