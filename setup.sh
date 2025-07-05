#!/bin/bash

echo "================================"
echo "Social Media Downloader Setup"
echo "================================"
echo

echo "[1/4] Installing server dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install server dependencies"
    exit 1
fi

echo
echo "[2/4] Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install client dependencies"
    exit 1
fi

echo
echo "[3/4] Building React app..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Failed to build React app"
    exit 1
fi

cd ..

echo
echo "[4/4] Setup completed successfully!"
echo
echo "Next steps:"
echo "1. Configure your .env file with appropriate settings"
echo "2. Add cookies to cookie.txt (optional but recommended)"
echo "3. Run 'npm start' to start the application"
echo
echo "The application will be available at http://localhost:3001"
echo
