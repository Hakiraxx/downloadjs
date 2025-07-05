// Vercel serverless function entry point
const express = require('express');
const path = require('path');
const cors = require('cors');

// Import config and utilities
const config = require('../config/app');
const { securityMiddleware, corsMiddleware, rateLimitMiddleware } = require('../middleware/security');

// Import routes
const apiRoutes = require('../routes/api');
const soundcloudRoutes = require('../routes/soundcloud');
const proxyRoutes = require('../routes/proxy');
const diagnosticRoutes = require('../routes/diagnostic');

const app = express();

// Apply middleware for Vercel
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api/', rateLimitMiddleware);

// API Routes
app.use('/api', apiRoutes);
app.use('/api/soundcloud', soundcloudRoutes);
app.use('/api', proxyRoutes);
app.use('/api/tiktok', diagnosticRoutes);

// Simple frontend for Vercel (since we can't build React easily)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Social Media Downloader API</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; text-align: center; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #007bff; }
            .method { color: #28a745; font-weight: bold; }
            .url { color: #6c757d; font-family: monospace; }
            .note { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Social Media Downloader API</h1>
            <p>Welcome to the Social Media Downloader API running on Vercel!</p>
            
            <h2>📋 Available Endpoints:</h2>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/facebook/download</span><br>
                Download Facebook videos
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/instagram/download</span><br>
                Download Instagram content
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/tiktok/video/download</span><br>
                Download TikTok videos
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/tiktok/photo/download</span><br>
                Download TikTok photos
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/soundcloud/info</span><br>
                Get SoundCloud track info
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/soundcloud/download</span><br>
                Download SoundCloud tracks
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="url">/api/health</span><br>
                Health check endpoint
            </div>
            
            <div class="note">
                <strong>⚠️ Note:</strong> This is running on Vercel serverless. For full React frontend, deploy to Railway, Render, or Heroku.
            </div>
            
            <h2>📝 Usage Example:</h2>
            <pre style="background: #f1f3f4; padding: 15px; border-radius: 5px; overflow-x: auto;">
curl -X POST ${req.protocol}://${req.get('host')}/api/facebook/download \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.facebook.com/reel/..."}'
            </pre>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
