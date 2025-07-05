// Test script for local verification
const app = require('./api/index.js');
const http = require('http');

const port = 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`🚀 Test server running at http://localhost:${port}`);
  console.log(`📋 API Documentation: http://localhost:${port}`);
  console.log(`❤️ Health Check: http://localhost:${port}/api/health`);
  
  // Test the health endpoint
  setTimeout(() => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('\n✅ Health check response:', JSON.parse(data));
        console.log('\n🎯 API is working correctly!');
        server.close();
      });
    });

    req.on('error', (err) => {
      console.error('❌ Health check failed:', err);
      server.close();
    });

    req.end();
  }, 1000);
});
