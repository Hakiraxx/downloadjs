#!/bin/bash

echo "Starting Social Media Downloader..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error: Failed to install dependencies"
        exit 1
    fi
fi

# Check if client is built
if [ ! -d "client/build" ]; then
    echo "Building client..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "Error: Failed to build client"
        exit 1
    fi
fi

echo
echo "Starting server in LOCAL mode..."
echo "Press Ctrl+C to stop"
echo

# Start in local mode
npm run start:local
