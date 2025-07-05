const express = require('express');
const router = express.Router();
const axios = require('axios');

// Import services
const tiktokVideoService = require('../services/tiktokVideoService');

// TikTok diagnostic endpoint
router.post('/diagnostic', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const diagnostics = {
      url: url,
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Basic URL accessibility
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000,
        maxRedirects: 3,
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      diagnostics.tests.push({
        test: 'Basic Access',
        status: response.status,
        result: response.status === 200 ? 'PASS' : 'FAIL',
        details: `HTTP ${response.status}`
      });
    } catch (error) {
      diagnostics.tests.push({
        test: 'Basic Access',
        result: 'FAIL',
        error: error.message
      });
    }

    // Test 2: TikTok video service
    try {
      await tiktokVideoService.downloadVideo(url);
      diagnostics.tests.push({
        test: 'TikTok Video Service',
        result: 'PASS',
        details: 'Successfully extracted video data'
      });
    } catch (error) {
      diagnostics.tests.push({
        test: 'TikTok Video Service',
        result: 'FAIL',
        error: error.message
      });
    }

    // Summary
    const passedTests = diagnostics.tests.filter(t => t.result === 'PASS').length;
    const totalTests = diagnostics.tests.length;
    diagnostics.summary = {
      passed: passedTests,
      total: totalTests,
      success_rate: `${Math.round((passedTests / totalTests) * 100)}%`,
      recommendation: passedTests === 0 ? 
        'Video may be region-blocked, private, or requires login' :
        passedTests < totalTests ?
        'Service partially accessible - some issues detected' :
        'Full access available'
    };

    res.json(diagnostics);
  } catch (error) {
    console.error('TikTok diagnostic error:', error);
    res.status(500).json({ error: 'Diagnostic failed: ' + error.message });
  }
});

module.exports = router;
