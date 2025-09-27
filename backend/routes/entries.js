const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const Analytics = require('../models/Analytics');

// GET /api/entries - Get all entries with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (req.query.entryType) {
      filter.entryType = req.query.entryType;
    }
    
    if (req.query.mood) {
      filter.mood = req.query.mood;
    }
    
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo);
      }
    }
    
    // Get entries with pagination
    const entries = await Entry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('promptId', 'question category');
    
    // Get total count for pagination
    const total = await Entry.countDocuments(filter);
    
    res.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// GET /api/entries/:id - Get specific entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('promptId');
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// POST /api/entries - Create new entry
router.post('/', async (req, res) => {
  try {
    const entryData = {
      content: req.body.content,
      title: req.body.title || '',
      mood: req.body.mood || '😌',
      moodScore: req.body.moodScore || 5,
      entryType: req.body.entryType || 'free-write',
      tags: req.body.tags || [],
      quickAnswers: req.body.quickAnswers || {},
      selectedEmojis: req.body.selectedEmojis || [],
      promptId: req.body.promptId || null,
      isDraft: req.body.isDraft || false,
      isPrivate: req.body.isPrivate !== false
    };
    
    const entry = new Entry(entryData);
    await entry.save();
    
    // Update analytics for the day
    await updateDailyAnalytics(entry);
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PUT /api/entries/:id - Update entry
router.put('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        entry[key] = req.body[key];
      }
    });
    
    entry.updatedAt = new Date();
    await entry.save();
    
    // Update analytics if mood or content changed
    if (req.body.mood || req.body.content) {
      await updateDailyAnalytics(entry);
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// DELETE /api/entries/:id - Delete entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    // Update analytics to reflect deletion
    await updateDailyAnalyticsAfterDeletion(entry);
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// GET /api/entries/stats/summary - Get entry statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalEntries = await Entry.countDocuments();
    const totalWords = await Entry.aggregate([
      { $group: { _id: null, total: { $sum: '$wordCount' } } }
    ]);
    
    const moodDistribution = await Entry.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const entryTypeDistribution = await Entry.aggregate([
      { $group: { _id: '$entryType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const recentEntries = await Entry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title mood createdAt entryType');
    
    res.json({
      totalEntries,
      totalWords: totalWords[0]?.total || 0,
      moodDistribution,
      entryTypeDistribution,
      recentEntries
    });
  } catch (error) {
    console.error('Error fetching entry stats:', error);
    res.status(500).json({ error: 'Failed to fetch entry statistics' });
  }
});

// Helper function to update daily analytics
async function updateDailyAnalytics(entry) {
  try {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    
    let analytics = await Analytics.findOne({ date: entryDate });
    
    if (!analytics) {
      analytics = new Analytics({
        date: entryDate,
        entriesCount: 0,
        totalWordCount: 0,
        dailyMood: entry.mood,
        moodScore: entry.moodScore
      });
    }
    
    // Update counts
    analytics.entriesCount += 1;
    analytics.totalWordCount += entry.wordCount;
    
    // Update mood if this is the first entry of the day or if mood score is higher
    if (!analytics.dailyMood || entry.moodScore > analytics.moodScore) {
      analytics.dailyMood = entry.mood;
      analytics.moodScore = entry.moodScore;
    }
    
    // Update entry types
    const existingType = analytics.entryTypes.find(et => et.type === entry.entryType);
    if (existingType) {
      existingType.count += 1;
    } else {
      analytics.entryTypes.push({ type: entry.entryType, count: 1 });
    }
    
    // Update writing time
    const hour = new Date(entry.createdAt).getHours();
    if (hour >= 5 && hour < 12) {
      analytics.writingTime = 'morning';
    } else if (hour >= 12 && hour < 17) {
      analytics.writingTime = 'afternoon';
    } else if (hour >= 17 && hour < 22) {
      analytics.writingTime = 'evening';
    } else {
      analytics.writingTime = 'night';
    }
    
    await analytics.save();
    
    // Update streak
    await updateStreak(analytics);
    
  } catch (error) {
    console.error('Error updating daily analytics:', error);
  }
}

// Helper function to update analytics after deletion
async function updateDailyAnalyticsAfterDeletion(entry) {
  try {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    
    const analytics = await Analytics.findOne({ date: entryDate });
    if (analytics) {
      analytics.entriesCount = Math.max(0, analytics.entriesCount - 1);
      analytics.totalWordCount = Math.max(0, analytics.totalWordCount - entry.wordCount);
      
      // Update entry types
      const typeIndex = analytics.entryTypes.findIndex(et => et.type === entry.entryType);
      if (typeIndex !== -1) {
        analytics.entryTypes[typeIndex].count = Math.max(0, analytics.entryTypes[typeIndex].count - 1);
        if (analytics.entryTypes[typeIndex].count === 0) {
          analytics.entryTypes.splice(typeIndex, 1);
        }
      }
      
      await analytics.save();
    }
  } catch (error) {
    console.error('Error updating analytics after deletion:', error);
  }
}

// Helper function to update streak
async function updateStreak(analytics) {
  try {
    // Get all analytics entries sorted by date
    const allAnalytics = await Analytics.find()
      .sort({ date: -1 });
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < allAnalytics.length; i++) {
      const current = allAnalytics[i];
      const next = allAnalytics[i + 1];
      
      if (current.entriesCount > 0) {
        tempStreak++;
        
        if (i === 0) {
          currentStreak = tempStreak;
        }
        
        // Check if streak continues
        if (next) {
          const daysDiff = Math.floor((current.date - next.date) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    // Update all analytics entries with streak data
    await Analytics.updateMany(
      {},
      { 
        $set: { 
          currentStreak: currentStreak,
          longestStreak: longestStreak
        }
      }
    );
    
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

module.exports = router;
