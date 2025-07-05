const express = require('express');
const path = require('path');

// Import config and utilities
const config = require('./config/app');
const { cleanupOldSoundCloudFiles } = require('./utils/helpers');
const { securityMiddleware, corsMiddleware, rateLimitMiddleware } = require('./middleware/security');

// Import routes
const apiRoutes = require('./routes/api');
const soundcloudRoutes = require('./routes/soundcloud');
const proxyRoutes = require('./routes/proxy');
const diagnosticRoutes = require('./routes/diagnostic');

const app = express();
const PORT = config.port;

// Run cleanup on startup
cleanupOldSoundCloudFiles();

// Apply middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api/', rateLimitMiddleware);

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.use('/api', apiRoutes);
app.use('/api/soundcloud', soundcloudRoutes);
app.use('/api', proxyRoutes);
app.use('/api/tiktok', diagnosticRoutes);

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only if not running on Vercel
if (!config.environment.isHosting || !process.env.VERCEL) {
  app.listen(PORT, config.host, () => {
    console.log(`🚀 Server is running on ${config.host}:${PORT}`);
    console.log(`📱 Environment: ${config.nodeEnv}`);
    console.log(`🌍 Platform: ${config.environment.platform}`);
    
    if (config.environment.isLocal) {
      console.log(`🔗 Local access: http://localhost:${PORT}`);
      console.log(`🔗 Network access: http://${config.host}:${PORT}`);
    }
  });
}

module.exports = app;
