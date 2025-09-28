# 🚀 DEPLOY ECHO JOURNAL NOW!

## 🎯 **Quick Deployment Steps**

### **Step 1: Deploy Backend to Railway** 🚂

1. **Go to Railway**: [railway.app](https://railway.app)
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your `echo-frontend` repository**
6. **Set Root Directory**: `backend`
7. **Click Deploy**

### **Step 2: Set Backend Environment Variables** 🔧

In Railway dashboard, go to **Variables** tab and add:

```env
MONGODB_URI=mongodb+srv://bhuvishibansal_db_user:Ananya3722@cluster0.l8qd4yq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=3000
```

**⚠️ Replace `your-vercel-url` with your actual Vercel URL after frontend deployment**

### **Step 3: Get Backend URL** 📍

- Railway will give you a URL like: `https://echo-journal-backend-production.up.railway.app`
- **SAVE THIS URL** - you'll need it for the frontend!

---

### **Step 4: Deploy Frontend to Vercel** ⚡

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your `echo-frontend` repository**
5. **Set Framework Preset**: Next.js
6. **Click Deploy**

### **Step 5: Set Frontend Environment Variables** 🔧

In Vercel dashboard, go to **Settings > Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.up.railway.app
```

**⚠️ Replace `your-railway-backend-url` with your actual Railway URL**

### **Step 6: Update Backend with Frontend URL** 🔄

Go back to Railway and update the `FRONTEND_URL` variable with your actual Vercel URL.

---

## 🎉 **You're Done!**

Your Echo Journal app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`

## 🧪 **Test Your Deployment**

1. **Visit your Vercel URL**
2. **Complete onboarding**
3. **Try writing a journal entry**
4. **Check all features work**

**Status: 🚀 LIVE AND READY FOR HACKATHON!**
