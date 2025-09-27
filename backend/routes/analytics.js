const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Entry = require('../models/Entry');

// GET /api/analytics/mood-timeline - Get mood timeline data
router.get('/mood-timeline', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const timeline = await Analytics.getMoodTimeline(days);
    
    res.json(timeline);
  } catch (error) {
    console.error('Error fetching mood timeline:', error);
    res.status(500).json({ error: 'Failed to fetch mood timeline' });
  }
});

// GET /api/analytics/streak - Get streak data
router.get('/streak', async (req, res) => {
  try {
    const streakData = await Analytics.getStreakData();
    
    res.json(streakData || { currentStreak: 0, longestStreak: 0 });
  } catch (error) {
    console.error('Error fetching streak data:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

// GET /api/analytics/weekly - Get weekly summary
router.get('/weekly', async (req, res) => {
  try {
    const weekNumber = parseInt(req.query.week) || new Date().getWeek();
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const weeklyData = await Analytics.getWeeklySummary(weekNumber, year);
    
    res.json(weeklyData);
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    res.status(500).json({ error: 'Failed to fetch weekly data' });
  }
});

// GET /api/analytics/monthly - Get monthly summary
router.get('/monthly', async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const monthlyData = await Analytics.getMonthlySummary(month, year);
    
    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Failed to fetch monthly data' });
  }
});

// GET /api/analytics/insights - Get personalized insights
router.get('/insights', async (req, res) => {
  try {
    const insights = [];
    
    // Most reflective times
    const writingTimes = await Analytics.aggregate([
      { $group: { _id: '$writingTime', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    if (writingTimes.length > 0) {
      const mostCommonTime = writingTimes[0];
      insights.push({
        title: "Your most reflective times",
        description: `You tend to journal most during ${mostCommonTime._id || 'evening'}`,
        type: 'pattern',
        data: writingTimes
      });
    }
    
    // Mood patterns
    const moodPatterns = await Analytics.aggregate([
      { $group: { _id: '$dailyMood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    if (moodPatterns.length > 0) {
      const dominantMood = moodPatterns[0];
      insights.push({
        title: "Your emotional landscape",
        description: `Your most common mood is ${dominantMood._id}`,
        type: 'emotion',
        data: moodPatterns
      });
    }
    
    // Growth themes from entries
    const growthThemes = await Entry.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    if (growthThemes.length > 0) {
      insights.push({
        title: "Words that define your journey",
        description: `Your most frequent themes: ${growthThemes.slice(0, 3).map(t => t._id).join(', ')}`,
        type: 'growth',
        data: growthThemes
      });
    }
    
    // Writing consistency
    const totalDays = await Analytics.countDocuments();
    const daysWithEntries = await Analytics.countDocuments({ entriesCount: { $gt: 0 } });
    const consistencyRate = totalDays > 0 ? (daysWithEntries / totalDays) * 100 : 0;
    
    insights.push({
      title: "Your writing consistency",
      description: `You've journaled on ${Math.round(consistencyRate)}% of days`,
      type: 'consistency',
      data: { consistencyRate, totalDays, daysWithEntries }
    });
    
    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// GET /api/analytics/patterns - Get writing patterns
router.get('/patterns', async (req, res) => {
  try {
    const patterns = {};
    
    // Entry type patterns
    patterns.entryTypes = await Entry.aggregate([
      { $group: { _id: '$entryType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Mood patterns over time
    patterns.moodTimeline = await Analytics.aggregate([
      { $match: { dailyMood: { $exists: true } } },
      { $group: { _id: '$dailyMood', count: { $sum: 1 }, avgScore: { $avg: '$moodScore' } } },
      { $sort: { count: -1 } }
    ]);
    
    // Writing time patterns
    patterns.writingTimes = await Analytics.aggregate([
      { $match: { writingTime: { $exists: true } } },
      { $group: { _id: '$writingTime', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Word count patterns
    patterns.wordCountStats = await Analytics.aggregate([
      { $match: { totalWordCount: { $gt: 0 } } },
      { $group: { 
        _id: null, 
        avgWords: { $avg: '$totalWordCount' },
        maxWords: { $max: '$totalWordCount' },
        minWords: { $min: '$totalWordCount' }
      }}
    ]);
    
    res.json(patterns);
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ error: 'Failed to fetch patterns' });
  }
});

// GET /api/analytics/time-capsule - Get time capsule data
router.get('/time-capsule', async (req, res) => {
  try {
    const monthsAgo = parseInt(req.query.months) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
    
    // Get old entries for time capsule
    const oldEntries = await Entry.find({
      createdAt: { $lt: cutoffDate }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('content mood createdAt tags');
    
    const timeCapsules = oldEntries.map(entry => ({
      date: entry.createdAt.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      content: entry.content.substring(0, 200) + (entry.content.length > 200 ? '...' : ''),
      mood: entry.mood,
      tags: entry.tags
    }));
    
    res.json(timeCapsules);
  } catch (error) {
    console.error('Error fetching time capsule:', error);
    res.status(500).json({ error: 'Failed to fetch time capsule data' });
  }
});

// GET /api/analytics/dashboard - Get dashboard summary data
router.get('/dashboard', async (req, res) => {
  try {
    // Current streak
    const streakData = await Analytics.getStreakData();
    
    // Recent mood timeline (last 7 days)
    const moodTimeline = await Analytics.getMoodTimeline(7);
    
    // This week's word
    const recentEntries = await Entry.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('tags');
    
    const allTags = recentEntries.flatMap(entry => entry.tags);
    const tagCounts = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    const thisWeeksWord = Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b, 'Growth'
    );
    
    // Next milestone
    const currentStreak = streakData?.currentStreak || 0;
    const nextMilestone = Math.ceil(currentStreak / 10) * 10;
    const progress = (currentStreak % 10) / 10;
    
    // Weekly mood data
    const weeklyMoodData = moodTimeline.map(day => ({
      day: day.date.toLocaleDateString('en-US', { weekday: 'short' }),
      emoji: day.dailyMood || '😌',
      mood: day.moodScore || 5
    }));
    
    res.json({
      streak: {
        current: currentStreak,
        longest: streakData?.longestStreak || 0
      },
      thisWeeksWord,
      nextMilestone: {
        target: nextMilestone,
        progress: progress,
        current: currentStreak
      },
      weeklyMood: weeklyMoodData,
      insights: {
        totalEntries: await Entry.countDocuments(),
        totalWords: await Entry.aggregate([
          { $group: { _id: null, total: { $sum: '$wordCount' } } }
        ]).then(result => result[0]?.total || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
