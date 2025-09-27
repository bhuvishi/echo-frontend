# Echo Journal - Deployment Guide

## 🚀 Complete Deployment Instructions

This guide covers deploying both the frontend (Next.js) and backend (Node.js + MongoDB) for the Echo Journal application.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Git installed
- Vercel account (for frontend)
- Railway/Render/Heroku account (for backend)

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP addresses

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/echo-journal`

## 🔧 Backend Deployment

### Step 1: Prepare Backend

```bash
cd backend
npm install
```

### Step 2: Environment Configuration

Create `backend/.env` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echo-journal

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-url.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 3: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Add environment variables in Railway dashboard
5. Deploy

### Step 4: Seed Database

After deployment, run the seed script:

```bash
# SSH into your Railway instance or run locally with production DB
node scripts/seed-prompts.js
```

## 🎨 Frontend Deployment

### Step 1: Prepare Frontend

```bash
# In the root directory
npm install
```

### Step 2: Environment Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

## 🔄 Local Development Setup

### Backend

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend

```bash
# In root directory
npm install
cp env.local.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

## 📊 Database Structure

### Collections

#### `entries`
```javascript
{
  _id: ObjectId,
  content: String,           // Journal entry content
  title: String,            // Entry title
  mood: String,             // Emoji mood
  moodScore: Number,        // 1-10 mood score
  entryType: String,       // 'free-write', 'quick-thoughts', 'emojis', 'voice'
  tags: [String],          // Entry tags
  quickAnswers: {          // For structured entries
    feeling: String,
    grateful: String,
    challenges: String
  },
  selectedEmojis: [String], // For emoji entries
  wordCount: Number,       // Auto-calculated
  createdAt: Date,
  updatedAt: Date,
  promptId: ObjectId,      // Reference to prompt
  isDraft: Boolean,
  isPrivate: Boolean
}
```

#### `prompts`
```javascript
{
  _id: ObjectId,
  title: String,           // Prompt title
  question: String,        // The actual prompt question
  category: String,        // 'reflection', 'gratitude', 'goals', etc.
  difficulty: String,      // 'beginner', 'intermediate', 'advanced'
  targetAudience: String,  // 'all', 'beginners', 'experienced'
  usageCount: Number,      // How many times used
  lastUsed: Date,         // Last time this prompt was used
  isActive: Boolean,      // Whether prompt is active
  priority: Number,       // Selection priority (1-10)
  tags: [String],        // Prompt tags
  createdAt: Date,
  updatedAt: Date
}
```

#### `analytics`
```javascript
{
  _id: ObjectId,
  date: Date,             // Date for daily analytics
  dailyMood: String,      // Daily mood emoji
  moodScore: Number,      // Daily mood score
  entriesCount: Number,   // Number of entries that day
  totalWordCount: Number, // Total words written that day
  averageWordCount: Number, // Average words per entry
  mostUsedWords: [{       // Most frequent words
    word: String,
    count: Number
  }],
  entryTypes: [{          // Entry type distribution
    type: String,
    count: Number
  }],
  writingTime: String,    // 'morning', 'afternoon', 'evening', 'night'
  currentStreak: Number,  // Current writing streak
  longestStreak: Number,  // Longest streak achieved
  weekNumber: Number,     // Week of year
  month: Number,          // Month (1-12)
  year: Number,           // Year
  growthThemes: [{        // Growth themes
    theme: String,
    frequency: Number
  }],
  emotionalPattern: String, // 'positive', 'neutral', 'negative', 'mixed'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Entries
- `GET /api/entries` - Get all entries (with pagination)
- `GET /api/entries/:id` - Get specific entry
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `GET /api/entries/stats/summary` - Get entry statistics

### Prompts
- `GET /api/prompts` - Get all prompts
- `GET /api/prompts/random` - Get random prompt
- `GET /api/prompts/daily` - Get today's prompt
- `GET /api/prompts/personalized` - Get personalized prompt
- `GET /api/prompts/:id` - Get specific prompt
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard data
- `GET /api/analytics/mood-timeline` - Get mood timeline
- `GET /api/analytics/streak` - Get streak data
- `GET /api/analytics/insights` - Get personalized insights
- `GET /api/analytics/time-capsule` - Get time capsule data

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in backend
2. **Database Connection**: Check MongoDB URI and network access
3. **Rate Limiting**: Adjust rate limit settings if needed
4. **Environment Variables**: Ensure all required env vars are set

### Health Check

Backend health endpoint: `GET /api/health`

## 📈 Monitoring

- Backend logs: Check Railway/Render dashboard
- Frontend logs: Check Vercel dashboard
- Database: Monitor MongoDB Atlas dashboard

## 🔐 Security Notes

- Never commit `.env` files
- Use environment variables for all secrets
- Enable CORS only for your frontend domain
- Use rate limiting to prevent abuse
- Keep dependencies updated

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database seeded with initial prompts
- [ ] Frontend deployed and connected to backend
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Health check endpoints working
- [ ] Test journal entry creation
- [ ] Test analytics data retrieval

## 🎯 Production URLs

After deployment, your app will be available at:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **API Health**: `https://your-backend.railway.app/api/health`

## 📞 Support

If you encounter issues:

1. Check the logs in your deployment platform
2. Verify environment variables
3. Test API endpoints directly
4. Check database connectivity
5. Review CORS settings

The application is now fully functional with a complete backend, MongoDB database, and deployable frontend!
