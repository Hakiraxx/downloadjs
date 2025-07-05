@echo off
echo 🚀 Deploying Simple API to Vercel...

echo.
echo 📦 Vercel Configuration:
echo    - API Only: YES
echo    - Client Build: DISABLED
echo    - Framework: Node.js/Other
echo.

echo 🔍 Checking API file...
node -c api/index.js
if %errorlevel% neq 0 (
    echo ❌ API file has syntax errors!
    pause
    exit /b 1
)
echo ✅ API file is valid

echo.
echo 📋 Files that will be deployed:
echo    - api/index.js (main serverless function)
echo    - package.json (dependencies)
echo    - services/ (business logic)
echo    - .vercelignore (excludes client/)
echo.

echo 🌐 Starting deployment...
vercel --prod

echo.
echo ✅ Deployment complete!
echo 📝 Tips:
echo    - Root URL will show API documentation
echo    - Test: /api/health endpoint
echo    - All /api/* endpoints are available
echo.
pause
