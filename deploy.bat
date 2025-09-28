@echo off
echo 🚀 Echo Journal Deployment Helper
echo.

echo 📋 DEPLOYMENT CHECKLIST:
echo.
echo 1. Backend (Railway):
echo    - Go to: https://railway.app
echo    - Sign up with GitHub
echo    - New Project > Deploy from GitHub
echo    - Select: echo-frontend repository
echo    - Set Root Directory: backend
echo    - Add environment variables (see DEPLOY_NOW.md)
echo.
echo 2. Frontend (Vercel):
echo    - Go to: https://vercel.com
echo    - Sign up with GitHub
echo    - New Project > Import from GitHub
echo    - Select: echo-frontend repository
echo    - Set Framework: Next.js
echo    - Add environment variables (see DEPLOY_NOW.md)
echo.
echo 📖 For detailed steps, see: DEPLOY_NOW.md
echo.
echo 🎯 Your app will be live at:
echo    - Frontend: https://your-app.vercel.app
echo    - Backend: https://your-backend.up.railway.app
echo.
pause
