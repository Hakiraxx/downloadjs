@echo off
echo ================================
echo Social Media Downloader Setup
echo ================================
echo.

echo [1/4] Installing server dependencies...
call npm install
if errorlevel 1 (
    echo Error: Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo Error: Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Building React app...
call npm run build
if errorlevel 1 (
    echo Error: Failed to build React app
    pause
    exit /b 1
)

cd ..

echo.
echo [4/4] Setup completed successfully!
echo.
echo Next steps:
echo 1. Configure your .env file with appropriate settings
echo 2. Add cookies to cookie.txt (optional but recommended)
echo 3. Run 'npm start' to start the application
echo.
echo The application will be available at http://localhost:3001
echo.
pause
