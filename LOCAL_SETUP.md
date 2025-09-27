# Echo Journal - Local Setup Guide

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)
1. **Run Setup**: Double-click `setup.bat`
2. **Start App**: Double-click `start-dev.bat`
3. **Open Browser**: Go to `http://localhost:3002`

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

#### 2. Start Backend
```bash
cd backend
node server.js
```
Backend will run on: `http://localhost:3001`

#### 3. Start Frontend
```bash
npm run dev
```
Frontend will run on: `http://localhost:3002`

## 🗄️ Database Configuration

Your MongoDB Atlas database is already configured:
- **Database**: `echo-journal`
- **Connection**: `mongodb+srv://bhuvishibansal_db_user:Ananya3*7=22@cluster0.l8qd4yq.mongodb.net/echo-journal`

## 📊 Database Seeding

The database will be automatically seeded with:
- **16+ Reflection Prompts** - Various categories and difficulties
- **Sample Analytics Data** - For testing the growth tracker
- **Database Collections** - entries, prompts, analytics

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://bhuvishibansal_db_user:Ananya3*7=22@cluster0.l8qd4yq.mongodb.net/echo-journal
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎯 What Works

### ✅ Full Functionality
- **Onboarding Flow** - Set your preferences
- **Dashboard** - Real-time data from MongoDB
- **Writing Interface** - Save entries to database
- **Growth Tracker** - Real analytics and insights
- **Past Entries** - Browse your journal history
- **Profile Settings** - Personalize your experience

### ✅ Database Features
- **Journal Entries** - Stored with mood, tags, timestamps
- **Dynamic Prompts** - Fetched from database
- **Analytics** - Mood patterns, streaks, insights
- **Time Capsule** - Historical entry reflection

## 🚀 URLs

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🛠️ Troubleshooting

### Backend Issues
- Check if MongoDB connection is working
- Verify environment variables in `backend/.env`
- Check backend logs for errors

### Frontend Issues
- Check if backend is running on port 3001
- Verify `.env.local` file exists
- Clear browser cache if needed

### Database Issues
- Run `node scripts/seed-prompts.js` to seed database
- Check MongoDB Atlas connection
- Verify database permissions

## 📝 Development Notes

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js + React + TypeScript
- **Database**: MongoDB Atlas (cloud)
- **Styling**: Tailwind CSS with glassmorphism effects

## 🎉 Ready to Journal!

Your Echo Journal app is now fully functional with:
- ✅ Real database connectivity
- ✅ Dynamic prompts from MongoDB
- ✅ Analytics and insights
- ✅ Beautiful UI with glassmorphism effects
- ✅ Complete journaling experience

**Start journaling at: http://localhost:3002** 🎉
