@echo off
echo 🔧 Setting up for Vercel deployment...

REM Backup original package.json
copy package.json package-full.json >nul

REM Use Vercel-specific package.json
copy package-vercel.json package.json >nul

echo ✅ Vercel setup complete!
echo 📝 Now run: vercel --prod
echo ⚠️ Note: This will deploy API-only version

echo.
echo 🔄 To restore full package.json after deployment:
echo    copy package-full.json package.json
pause
