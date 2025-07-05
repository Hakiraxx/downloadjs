require('dotenv').config();

// Detect if running on hosting platform
const isProduction = process.env.NODE_ENV === 'production';
const isHeroku = !!process.env.DYNO;
const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
const isRender = !!process.env.RENDER;
const isVercel = !!process.env.VERCEL;
const isHosting = isHeroku || isRailway || isRender || isVercel;

module.exports = {
  // Port configuration - hosting platforms set their own PORT
  port: process.env.PORT || (isHosting ? 8080 : 3001),
  host: isHosting ? '0.0.0.0' : (process.env.HOST || 'localhost'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Environment detection
  environment: {
    isProduction,
    isLocal: !isHosting,
    isHosting,
    platform: isHeroku ? 'heroku' : isRailway ? 'railway' : isRender ? 'render' : isVercel ? 'vercel' : 'local'
  },
  
  // Rate limiting config
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  },
  
  // File cleanup config
  cleanup: {
    soundCloudMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Allowed domains for downloads
  allowedDomains: [
    'fbcdn.net',
    'cdninstagram.com', 
    'instagram.com',
    'tiktokcdn.com',
    'tiktokcdn-us.com',
    'tiktokcdn.us',
    'muscdn.com',
    'muscdn.net',
    'bytecdn.com',
    'bytedanceapi.com',
    'tiktok.com',
    'musical.ly',
    'v16-webapp-prime.tiktok.com',
    'v16m-default.akamaized.net',
    'v19-webapp-prime.tiktok.com',
    'sf16-webapp-va.tiktokcdn.com',
    'sf16-ies-music-va.16.tiktokcdn.com',
    'sndcdn.com'
  ],
  
  // Allowed domains for image proxy
  imageProxyDomains: [
    'fbcdn.net',
    'cdninstagram.com', 
    'instagram.com',
    'tiktokcdn.com',
    'sndcdn.com'
  ],
  
  // Valid file extensions
  validExtensions: {
    video: ['mp4', 'webm', 'ts', 'm4v', 'mov', 'avi', 'mkv', 'flv'],
    image: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp']
  }
};
