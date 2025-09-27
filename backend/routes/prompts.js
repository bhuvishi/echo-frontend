const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// GET /api/prompts - Get all prompts with filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.tags) {
      filter.tags = { $in: req.query.tags.split(',') };
    }
    
    // Get prompts with pagination
    const prompts = await Prompt.find(filter)
      .sort({ priority: -1, usageCount: 1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Prompt.countDocuments(filter);
    
    res.json({
      prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/random - Get random prompt
router.get('/random', async (req, res) => {
  try {
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    
    const prompts = await Prompt.getRandomPrompt(category, difficulty);
    
    if (prompts.length === 0) {
      return res.status(404).json({ error: 'No prompts found' });
    }
    
    const prompt = prompts[0];
    
    // Increment usage count
    await prompt.incrementUsage();
    
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching random prompt:', error);
    res.status(500).json({ error: 'Failed to fetch random prompt' });
  }
});

// GET /api/prompts/daily - Get today's prompt (or generate one)
router.get('/daily', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Try to get a prompt that hasn't been used recently
    const recentPrompts = await Prompt.find({
      isActive: true,
      lastUsed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }).select('_id');
    
    const recentPromptIds = recentPrompts.map(p => p._id);
    
    const availablePrompts = await Prompt.find({
      isActive: true,
      _id: { $nin: recentPromptIds }
    }).sort({ priority: -1, usageCount: 1 });
    
    if (availablePrompts.length === 0) {
      // If no unused prompts, get any random prompt
      const randomPrompts = await Prompt.getRandomPrompt();
      const prompt = randomPrompts[0];
      
      if (prompt) {
        await prompt.incrementUsage();
        return res.json(prompt);
      }
    }
    
    // Select the first available prompt
    const prompt = availablePrompts[0];
    await prompt.incrementUsage();
    
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching daily prompt:', error);
    res.status(500).json({ error: 'Failed to fetch daily prompt' });
  }
});

// GET /api/prompts/personalized - Get personalized prompts based on user preferences
router.get('/personalized', async (req, res) => {
  try {
    const preferences = req.query;
    
    if (!preferences) {
      return res.status(400).json({ error: 'Preferences required' });
    }
    
    const prompts = await Prompt.getPromptsByPreferences(preferences);
    
    if (prompts.length === 0) {
      // Fallback to random prompt
      const randomPrompts = await Prompt.getRandomPrompt();
      return res.json(randomPrompts[0] || null);
    }
    
    // Return the first matching prompt
    const prompt = prompts[0];
    await prompt.incrementUsage();
    
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching personalized prompt:', error);
    res.status(500).json({ error: 'Failed to fetch personalized prompt' });
  }
});

// GET /api/prompts/:id - Get specific prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    res.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// POST /api/prompts - Create new prompt (admin function)
router.post('/', async (req, res) => {
  try {
    const promptData = {
      question: req.body.question,
      category: req.body.category,
      difficulty: req.body.difficulty || 'beginner',
      targetAudience: req.body.targetAudience || 'all',
      title: req.body.title,
      description: req.body.description || '',
      tags: req.body.tags || [],
      priority: req.body.priority || 1,
      isActive: req.body.isActive !== false
    };
    
    const prompt = new Prompt(promptData);
    await prompt.save();
    
    res.status(201).json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// PUT /api/prompts/:id - Update prompt
router.put('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        prompt[key] = req.body[key];
      }
    });
    
    prompt.updatedAt = new Date();
    await prompt.save();
    
    res.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/prompts/:id - Delete prompt (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    // Soft delete by setting isActive to false
    prompt.isActive = false;
    await prompt.save();
    
    res.json({ message: 'Prompt deactivated successfully' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

// GET /api/prompts/stats/summary - Get prompt statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalPrompts = await Prompt.countDocuments();
    const activePrompts = await Prompt.countDocuments({ isActive: true });
    
    const categoryDistribution = await Prompt.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const difficultyDistribution = await Prompt.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const mostUsedPrompts = await Prompt.find({ isActive: true })
      .sort({ usageCount: -1 })
      .limit(5)
      .select('title question usageCount category');
    
    const leastUsedPrompts = await Prompt.find({ isActive: true })
      .sort({ usageCount: 1 })
      .limit(5)
      .select('title question usageCount category');
    
    res.json({
      totalPrompts,
      activePrompts,
      categoryDistribution,
      difficultyDistribution,
      mostUsedPrompts,
      leastUsedPrompts
    });
  } catch (error) {
    console.error('Error fetching prompt stats:', error);
    res.status(500).json({ error: 'Failed to fetch prompt statistics' });
  }
});

module.exports = router;
