// Simple Vercel API with minimal dependencies
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    platform: 'Vercel',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    headers: req.headers,
    query: req.query
  });
});

// Placeholder endpoints (services will be added gradually)
app.post('/api/facebook/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'Facebook service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('Facebook download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download Facebook video' });
  }
});

app.post('/api/instagram/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'Instagram service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('Instagram download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download Instagram content' });
  }
});

app.post('/api/tiktok/video/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'TikTok video service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('TikTok video download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download TikTok video' });
  }
});

app.post('/api/tiktok/photo/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'TikTok photo service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('TikTok photo download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download TikTok photos' });
  }
});

app.post('/api/soundcloud/info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'SoundCloud info service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('SoundCloud info error:', error);
    res.status(500).json({ error: error.message || 'Failed to get SoundCloud track info' });
  }
});

app.post('/api/soundcloud/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Placeholder response
    res.json({ 
      message: 'SoundCloud download service is being prepared for Vercel',
      url: url,
      status: 'placeholder'
    });
  } catch (error) {
    console.error('SoundCloud download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download SoundCloud track' });
  }
});

// Frontend documentation page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Social Media Downloader API</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container { 
                max-width: 900px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 15px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 { 
                color: #333; 
                text-align: center; 
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            .subtitle {
                text-align: center;
                color: #666;
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            .status {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
                font-weight: bold;
            }
            .endpoint { 
                background: #f8f9fa; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 8px; 
                border-left: 5px solid #007bff;
                transition: transform 0.2s;
            }
            .endpoint:hover {
                transform: translateX(5px);
            }
            .method { 
                color: #28a745; 
                font-weight: bold; 
                font-size: 0.9em;
                background: #e7f5e7;
                padding: 4px 8px;
                border-radius: 4px;
                margin-right: 10px;
            }
            .url { 
                color: #495057; 
                font-family: 'Courier New', monospace; 
                font-weight: bold;
            }
            .description {
                color: #6c757d;
                margin-top: 8px;
                font-style: italic;
            }
            .note { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 25px 0;
            }
            .example {
                background: #f1f3f4; 
                padding: 20px; 
                border-radius: 8px; 
                overflow-x: auto;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .feature {
                background: #e3f2fd;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .feature h3 {
                color: #1976d2;
                margin-top: 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Social Media Downloader API</h1>
            <p class="subtitle">Modern API for downloading content from social media platforms</p>
            
            <div class="status">
                ✅ API is running successfully on Vercel Serverless!
            </div>
            
            <div class="grid">
                <div class="feature">
                    <h3>🌐 Multi-Platform</h3>
                    <p>Support for Facebook, Instagram, TikTok, and SoundCloud</p>
                </div>
                <div class="feature">
                    <h3>⚡ Serverless</h3>
                    <p>Fast, scalable, and always available</p>
                </div>
                <div class="feature">
                    <h3>🔒 Secure</h3>
                    <p>Rate limited and protected API endpoints</p>
                </div>
            </div>
            
            <h2>📋 Available Endpoints:</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="url">/api/health</span>
                <div class="description">Health check and API status</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/facebook/download</span>
                <div class="description">Download Facebook videos and reels</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/instagram/download</span>
                <div class="description">Download Instagram posts, reels, and stories</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/tiktok/video/download</span>
                <div class="description">Download TikTok videos</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/tiktok/photo/download</span>
                <div class="description">Download TikTok photo slideshows</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/soundcloud/info</span>
                <div class="description">Get SoundCloud track information</div>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <span class="url">/api/soundcloud/download</span>
                <div class="description">Download SoundCloud tracks</div>
            </div>
            
            <div class="note">
                <strong>📝 Note:</strong> This is the API-only version running on Vercel serverless. 
                For the full React frontend experience, deploy to Railway, Render, or Heroku.
            </div>
            
            <h2>🔗 Usage Example:</h2>
            <div class="example">
curl -X POST ${req.protocol}://${req.get('host')}/api/health

curl -X POST ${req.protocol}://${req.get('host')}/api/facebook/download \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://www.facebook.com/reel/..."}'
            </div>
            
            <div style="text-align: center; margin-top: 40px; color: #666;">
                <p>🔧 Built with Express.js • Deployed on Vercel • ${new Date().getFullYear()}</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/facebook/download',
      'POST /api/instagram/download',
      'POST /api/tiktok/video/download',
      'POST /api/tiktok/photo/download',
      'POST /api/soundcloud/info',
      'POST /api/soundcloud/download'
    ]
  });
});

module.exports = app;
