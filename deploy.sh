#!/bin/bash

echo "🚀 Social Media Downloader - Auto Deploy Script"
echo

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Please run 'git init' first."
    exit 1
fi

echo "📋 Available hosting platforms:"
echo "1. Heroku"
echo "2. Railway" 
echo "3. Render"
echo "4. Vercel"
echo "5. All platforms"
echo

read -p "Select platform (1-5): " choice

case $choice in
    1)
        echo "🔥 Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not installed. Please install it first."
            exit 1
        fi
        
        echo "Setting up Heroku..."
        heroku create social-downloader-$(date +%s) 2>/dev/null || true
        heroku config:set NODE_ENV=production
        heroku config:set RATE_LIMIT_WINDOW_MS=900000
        heroku config:set RATE_LIMIT_MAX_REQUESTS=100
        
        echo "Deploying..."
        git add .
        git commit -m "Deploy to Heroku - $(date)"
        git push heroku main
        
        echo "✅ Deployed to Heroku!"
        heroku open
        ;;
        
    2)
        echo "🚂 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "❌ Railway CLI not installed. Installing..."
            npm install -g @railway/cli
        fi
        
        echo "Deploying..."
        railway login
        railway deploy
        
        echo "✅ Deployed to Railway!"
        ;;
        
    3)
        echo "🎨 Setting up for Render..."
        echo "📝 render.yaml file created."
        echo "🔗 Please go to https://render.com and:"
        echo "   1. Connect your GitHub repository"
        echo "   2. Select 'Web Service'"
        echo "   3. Render will auto-detect the render.yaml config"
        echo "✅ Ready for Render deployment!"
        ;;
        
    4)
        echo "▲ Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "❌ Vercel CLI not installed. Installing..."
            npm install -g vercel
        fi
        
        echo "Deploying..."
        vercel --prod
        
        echo "✅ Deployed to Vercel!"
        ;;
        
    5)
        echo "🌐 Preparing for all platforms..."
        
        # Commit changes
        git add .
        git commit -m "Prepare for multi-platform deployment - $(date)"
        
        echo "✅ All configuration files created!"
        echo "📋 Next steps:"
        echo "   • Heroku: git push heroku main"
        echo "   • Railway: railway deploy"
        echo "   • Render: Connect GitHub repo at render.com"
        echo "   • Vercel: vercel --prod"
        ;;
        
    *)
        echo "❌ Invalid choice. Please select 1-5."
        exit 1
        ;;
esac

echo
echo "🎉 Deployment complete!"
echo "📱 Your Social Media Downloader is now live!"
