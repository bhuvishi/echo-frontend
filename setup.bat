@echo off
echo Setting up Echo Journal...

echo.
echo Installing Frontend Dependencies...
npm install

echo.
echo Installing Backend Dependencies...
cd backend
npm install

echo.
echo Seeding Database with Initial Prompts...
node scripts/seed-prompts.js

echo.
echo Setup Complete!
echo.
echo To start the application, run: start-dev.bat
echo.
pause
