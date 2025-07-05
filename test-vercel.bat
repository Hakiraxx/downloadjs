@echo off
echo 🧪 Testing Vercel API Deployment...

set /p DOMAIN="Enter your Vercel domain (e.g., your-app.vercel.app): "

echo.
echo 🔍 Testing endpoints...

echo Testing health endpoint...
curl -X GET "https://%DOMAIN%/api/health"

echo.
echo.
echo Testing root documentation...
echo Opening browser to view frontend...
start https://%DOMAIN%

echo.
echo Testing Facebook endpoint (placeholder)...
curl -X POST "https://%DOMAIN%/api/facebook/download" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://facebook.com/test\"}"

echo.
echo.
echo ✅ All tests completed!
echo 📝 If all responses look good, your API is working correctly.
pause
