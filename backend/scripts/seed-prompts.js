const mongoose = require('mongoose');
const Prompt = require('../models/Prompt');
require('dotenv').config();

const initialPrompts = [
  // Reflection prompts
  {
    title: "Daily Joy",
    question: "What brought you joy today, and how did it make you feel in the moment? Sometimes the smallest moments carry the greatest meaning.",
    category: "reflection",
    difficulty: "beginner",
    tags: ["joy", "gratitude", "daily-life"],
    priority: 10
  },
  {
    title: "Inner Growth",
    question: "What is one way you've grown or changed in the past month? How do you feel about this growth?",
    category: "growth",
    difficulty: "intermediate",
    tags: ["growth", "self-awareness", "progress"],
    priority: 9
  },
  {
    title: "Emotional Weather",
    question: "If your emotions were weather today, what would they be? Describe the emotional climate of your inner world.",
    category: "emotions",
    difficulty: "beginner",
    tags: ["emotions", "metaphor", "self-awareness"],
    priority: 8
  },
  
  // Gratitude prompts
  {
    title: "Grateful Heart",
    question: "What are three things you're grateful for today, and why do they matter to you?",
    category: "gratitude",
    difficulty: "beginner",
    tags: ["gratitude", "appreciation", "positivity"],
    priority: 10
  },
  {
    title: "Hidden Blessings",
    question: "What's something that seemed like a challenge at first but turned out to be a blessing in disguise?",
    category: "gratitude",
    difficulty: "intermediate",
    tags: ["gratitude", "perspective", "resilience"],
    priority: 7
  },
  
  // Goals and future
  {
    title: "Future Self",
    question: "If you could have a conversation with yourself one year from now, what would you want to ask or tell them?",
    category: "goals",
    difficulty: "intermediate",
    tags: ["future", "goals", "self-reflection"],
    priority: 8
  },
  {
    title: "Dream Big",
    question: "What's one dream you've been putting off? What's the smallest step you could take toward it today?",
    category: "goals",
    difficulty: "beginner",
    tags: ["dreams", "action", "motivation"],
    priority: 9
  },
  
  // Relationships
  {
    title: "Connection Appreciation",
    question: "Who in your life has made a positive impact recently? How did they make you feel?",
    category: "relationships",
    difficulty: "beginner",
    tags: ["relationships", "appreciation", "connection"],
    priority: 8
  },
  {
    title: "Love Languages",
    question: "How do you prefer to give and receive love? What makes you feel most cared for?",
    category: "relationships",
    difficulty: "intermediate",
    tags: ["love", "relationships", "self-awareness"],
    priority: 6
  },
  
  // Creativity
  {
    title: "Creative Spark",
    question: "What's something that sparked your creativity or curiosity today? How did it make you feel?",
    category: "creativity",
    difficulty: "beginner",
    tags: ["creativity", "curiosity", "inspiration"],
    priority: 7
  },
  {
    title: "Artistic Expression",
    question: "If you could create something that represents how you feel right now, what would it be and why?",
    category: "creativity",
    difficulty: "intermediate",
    tags: ["creativity", "expression", "art"],
    priority: 6
  },
  
  // Mindfulness
  {
    title: "Present Moment",
    question: "What are you noticing about your body, mind, and heart in this moment? What do you need right now?",
    category: "mindfulness",
    difficulty: "beginner",
    tags: ["mindfulness", "present", "self-care"],
    priority: 9
  },
  {
    title: "Breath Awareness",
    question: "Take three deep breaths and notice what changes in your body and mind. What do you observe?",
    category: "mindfulness",
    difficulty: "beginner",
    tags: ["mindfulness", "breathing", "awareness"],
    priority: 8
  },
  
  // Daily life
  {
    title: "Daily Ritual",
    question: "What's one small ritual or habit that brings you comfort or joy? How does it make you feel?",
    category: "daily-life",
    difficulty: "beginner",
    tags: ["habits", "comfort", "daily-life"],
    priority: 7
  },
  {
    title: "Energy Check",
    question: "What activities or people give you energy, and which ones drain you? How can you honor this?",
    category: "daily-life",
    difficulty: "intermediate",
    tags: ["energy", "boundaries", "self-care"],
    priority: 6
  },
  
  // Future and aspirations
  {
    title: "Legacy Reflection",
    question: "What kind of impact do you want to have on the world? What's one small way you're already doing this?",
    category: "future",
    difficulty: "advanced",
    tags: ["legacy", "impact", "purpose"],
    priority: 5
  },
  {
    title: "Fear and Courage",
    question: "What's something you're afraid of but want to try anyway? What would courage look like for you?",
    category: "future",
    difficulty: "intermediate",
    tags: ["fear", "courage", "growth"],
    priority: 7
  }
];

async function seedPrompts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/echo-journal');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing prompts
    await Prompt.deleteMany({});
    console.log('🗑️ Cleared existing prompts');
    
    // Insert new prompts
    const prompts = await Prompt.insertMany(initialPrompts);
    console.log(`✅ Seeded ${prompts.length} prompts`);
    
    // Display summary
    const categories = await Prompt.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Prompt Categories:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} prompts`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedPrompts();
}

module.exports = seedPrompts;
