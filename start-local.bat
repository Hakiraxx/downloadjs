@echo off
echo Starting Social Media Downloader...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if client is built
if not exist "client\build" (
    echo Building client...
    npm run build
    if %errorlevel% neq 0 (
        echo Error: Failed to build client
        pause
        exit /b 1
    )
)

echo.
echo Starting server in LOCAL mode...
echo Press Ctrl+C to stop
echo.

REM Start in local mode
npm run start:local
