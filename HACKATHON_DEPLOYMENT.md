# 🚀 Echo Journal - Hackathon Deployment Guide

## 🎯 **Quick Deploy Checklist**

### ✅ **Backend → Railway**
1. **Push to GitHub** (already done)
2. **Connect Railway to GitHub**
3. **Set Environment Variables**
4. **Deploy & Get URL**

### ✅ **Frontend → Vercel**
1. **Connect Vercel to GitHub**
2. **Set Environment Variables**
3. **Deploy & Get URL**

---

## 🚂 **Backend Deployment (Railway)**

### **Step 1: Deploy to Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `echo-frontend` repository
6. Select **"backend"** folder as root directory

### **Step 2: Environment Variables**
In Railway dashboard, go to **Variables** tab and add:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=3000
```

**⚠️ SECURITY: Use your actual MongoDB Atlas connection string (see ENV_SETUP.md)**

### **Step 3: Get Backend URL**
- Railway will give you a URL like: `https://echo-journal-backend-production.up.railway.app`
- **Save this URL** - you'll need it for the frontend!

---

## ⚡ **Frontend Deployment (Vercel)**

### **Step 1: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your `echo-frontend` repository
5. **Root Directory**: Leave as root (not backend folder)

### **Step 2: Environment Variables**
In Vercel dashboard, go to **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app/api
```

**⚠️ IMPORTANT: Replace `your-railway-backend-url` with your actual Railway URL!**

### **Step 3: Deploy**
- Click **"Deploy"**
- Vercel will build and deploy your app
- You'll get a URL like: `https://echo-journal.vercel.app`

---

## 🔧 **Production Configuration**

### **Backend Production Settings**
- ✅ MongoDB Atlas connection
- ✅ CORS configured for Vercel
- ✅ Rate limiting enabled
- ✅ Health check endpoint
- ✅ Error handling

### **Frontend Production Settings**
- ✅ Environment variables for API URL
- ✅ Fallback data for offline mode
- ✅ Error boundaries
- ✅ Loading states

---

## 🧪 **Testing Your Deployment**

### **1. Test Backend**
```bash
curl https://your-railway-url.up.railway.app/api/health
```
Should return: `{"status":"OK","timestamp":"...","uptime":...}`

### **2. Test Frontend**
1. Open your Vercel URL
2. Complete onboarding
3. Try writing a journal entry
4. Check if data saves to MongoDB

### **3. Test Database**
1. Go to MongoDB Atlas
2. Check your `echo-journal` database
3. Verify entries are being saved

---

## 🚨 **Troubleshooting**

### **Backend Issues**
- **MongoDB Connection**: Check Atlas IP whitelist
- **CORS Errors**: Verify FRONTEND_URL in Railway
- **Port Issues**: Railway handles this automatically

### **Frontend Issues**
- **API Calls Failing**: Check NEXT_PUBLIC_API_URL
- **Build Errors**: Check Vercel build logs
- **Environment Variables**: Must start with NEXT_PUBLIC_

### **Database Issues**
- **Connection String**: Verify MongoDB URI
- **Network Access**: Add 0.0.0.0/0 to Atlas IP whitelist
- **Database Name**: Should be `echo-journal`

---

## 🎉 **Hackathon Ready!**

Your Echo Journal app is now:
- ✅ **Fully Deployed** - Backend on Railway, Frontend on Vercel
- ✅ **Database Connected** - MongoDB Atlas integration
- ✅ **Production Ready** - Error handling, fallbacks, monitoring
- ✅ **Scalable** - Can handle multiple users
- ✅ **Professional** - No hardcoded data, clean UI

**Demo URLs (replace with your actual URLs):**
- **Frontend**: `https://your-app.vercel.app` (from Vercel deployment)
- **Backend API**: `https://your-backend.up.railway.app/api` (from Railway deployment)
- **Health Check**: `https://your-backend.up.railway.app/api/health`

**Good luck at the hackathon! 🚀**
