# 🔐 Environment Variables Setup

## ⚠️ **SECURITY WARNING**
Never commit `.env` files or put real credentials in code!

## 🚀 **Quick Setup**

### **1. Backend Environment (.env)**
Create `backend/.env` with:
```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
PORT=3003
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
```

### **2. Frontend Environment (.env.local)**
Create `.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3003/api
```

## 🌐 **Production Setup**

### **Railway (Backend)**
Set these environment variables in Railway dashboard:
```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
PORT=3000
```

### **Vercel (Frontend)**
Set this environment variable in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
```

## 🔑 **Getting Your MongoDB Connection String**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `echo-journal`

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/echo-journal?retryWrites=true&w=majority
```

## ✅ **Security Checklist**
- [ ] `.env` files are in `.gitignore`
- [ ] No credentials in code
- [ ] No credentials in documentation
- [ ] Environment variables set in deployment platforms
