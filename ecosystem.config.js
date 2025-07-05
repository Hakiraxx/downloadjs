module.exports = {
  apps: [{
    name: 'social-media-downloader',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3001
    },
    // Restart settings
    max_memory_restart: '500M',
    restart_delay: 4000,
    
    // Logging
    log_file: './logs/app.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Auto restart on file changes (development only)
    watch: false,
    ignore_watch: ['node_modules', 'client/build', 'downloads'],
    
    // Health monitoring
    health_check_grace_period: 10000,
    
    // Advanced settings
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true
  }]
};
