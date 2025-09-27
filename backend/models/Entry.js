const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  // Entry content
  content: {
    type: String,
    required: true,
    maxlength: 10000 // 10k character limit
  },
  
  // Entry metadata
  title: {
    type: String,
    maxlength: 200,
    default: ''
  },
  
  // Mood and emotional state
  mood: {
    type: String,
    enum: ['😊', '😢', '😡', '😴', '🤔', '😌', '🥰', '😤', '😔', '✨', '🌱', '🌟', '🦋', '🕊️', '🌿'],
    default: '😌'
  },
  
  moodScore: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  
  // Entry type and mode
  entryType: {
    type: String,
    enum: ['free-write', 'quick-thoughts', 'emojis', 'voice'],
    default: 'free-write'
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    maxlength: 50
  }],
  
  // Quick answers for structured entries
  quickAnswers: {
    feeling: String,
    grateful: String,
    challenges: String
  },
  
  // Selected emojis for emoji entries
  selectedEmojis: [String],
  
  // Word count for analytics
  wordCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Associated prompt (if any)
  promptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt'
  },
  
  // Entry status
  isDraft: {
    type: Boolean,
    default: false
  },
  
  // Privacy settings
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
entrySchema.index({ createdAt: -1 });
entrySchema.index({ mood: 1 });
entrySchema.index({ entryType: 1 });
entrySchema.index({ tags: 1 });

// Pre-save middleware to calculate word count
entrySchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted date
entrySchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to get entry summary
entrySchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title || 'Untitled Entry',
    content: this.content.substring(0, 100) + (this.content.length > 100 ? '...' : ''),
    mood: this.mood,
    moodScore: this.moodScore,
    entryType: this.entryType,
    wordCount: this.wordCount,
    createdAt: this.createdAt,
    tags: this.tags
  };
};

module.exports = mongoose.model('Entry', entrySchema);
