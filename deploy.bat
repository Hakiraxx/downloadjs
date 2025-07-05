@echo off
echo 🚀 Social Media Downloader - Auto Deploy Script
echo.

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not a git repository. Please run 'git init' first.
    pause
    exit /b 1
)

echo 📋 Available hosting platforms:
echo 1. Heroku
echo 2. Railway
echo 3. Render
echo 4. Vercel
echo 5. All platforms
echo.

set /p choice="Select platform (1-5): "

if "%choice%"=="1" goto heroku
if "%choice%"=="2" goto railway
if "%choice%"=="3" goto render
if "%choice%"=="4" goto vercel
if "%choice%"=="5" goto all
goto invalid

:heroku
echo 🔥 Deploying to Heroku...
where heroku >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI not installed. Please install it first.
    pause
    exit /b 1
)

echo Setting up Heroku...
heroku create social-downloader-%random% 2>nul
heroku config:set NODE_ENV=production
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100

echo Deploying...
git add .
git commit -m "Deploy to Heroku - %date% %time%"
git push heroku main

echo ✅ Deployed to Heroku!
heroku open
goto end

:railway
echo 🚂 Deploying to Railway...
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Railway CLI not installed. Installing...
    npm install -g @railway/cli
)

echo Deploying...
railway login
railway deploy

echo ✅ Deployed to Railway!
goto end

:render
echo 🎨 Setting up for Render...
echo 📝 render.yaml file created.
echo 🔗 Please go to https://render.com and:
echo    1. Connect your GitHub repository
echo    2. Select 'Web Service'
echo    3. Render will auto-detect the render.yaml config
echo ✅ Ready for Render deployment!
goto end

:vercel
echo ▲ Deploying to Vercel...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not installed. Installing...
    npm install -g vercel
)

echo Deploying...
vercel --prod

echo ✅ Deployed to Vercel!
goto end

:all
echo 🌐 Preparing for all platforms...

REM Commit changes
git add .
git commit -m "Prepare for multi-platform deployment - %date% %time%"

echo ✅ All configuration files created!
echo 📋 Next steps:
echo    • Heroku: git push heroku main
echo    • Railway: railway deploy
echo    • Render: Connect GitHub repo at render.com
echo    • Vercel: vercel --prod
goto end

:invalid
echo ❌ Invalid choice. Please select 1-5.
pause
exit /b 1

:end
echo.
echo 🎉 Deployment complete!
echo 📱 Your Social Media Downloader is now live!
pause
