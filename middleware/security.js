const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../config/app');

// Security middleware with CSP
const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "*.fbcdn.net", "*.cdninstagram.com", "*.tiktokcdn.com", "*.sndcdn.com"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
  },
});

// CORS middleware
const corsMiddleware = cors();

// Rate limiting middleware
const rateLimitMiddleware = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  securityMiddleware,
  corsMiddleware,
  rateLimitMiddleware
};
