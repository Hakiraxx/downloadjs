#!/bin/bash

echo "🔧 Setting up for Vercel deployment..."

# Backup original package.json
cp package.json package-full.json

# Use Vercel-specific package.json
cp package-vercel.json package.json

echo "✅ Vercel setup complete!"
echo "📝 Now run: vercel --prod"
echo "⚠️  Note: This will deploy API-only version"

echo
echo "🔄 To restore full package.json after deployment:"
echo "   cp package-full.json package.json"
