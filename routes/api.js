const express = require('express');
const router = express.Router();

// Import services
const facebookService = require('../services/facebookService');
const instagramService = require('../services/instagramService');
const tiktokVideoService = require('../services/tiktokVideoService');
const tiktokPhotoService = require('../services/tiktokPhotoService');
const soundcloudService = require('../services/soundcloudService');

// Facebook download route
router.post('/facebook/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await facebookService.getVideo(url);
    res.json(result);
  } catch (error) {
    console.error('Facebook download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download Facebook video' });
  }
});

// Instagram download route
router.post('/instagram/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await instagramService.downloadAnyoneInInsta(url);
    res.json(result);
  } catch (error) {
    console.error('Instagram download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download Instagram content' });
  }
});

// TikTok video download route
router.post('/tiktok/video/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`🎯 TikTok Video Download Request: ${url}`);
    
    // Validate TikTok URL format
    if (!url.includes('tiktok.com') || !url.includes('/video/')) {
      return res.status(400).json({ 
        error: 'Invalid TikTok video URL. Please provide a valid TikTok video link.' 
      });
    }
    
    let result = null;
    
    // Use only the TikTok video service
    try {
      console.log('🎯 Attempting TikTok video service...');
      result = await tiktokVideoService.downloadVideo(url);
      if (result && result.videoUrl) {
        console.log('✅ TikTok video service successful');
        res.json(result);
        return;
      } else {
        throw new Error('No video URL found in service response');
      }
      
    } catch (error) {
      const errorMessage = error.message;
      console.log(`❌ TikTok video service failed: ${errorMessage}`);
      
      // Provide user-friendly error message
      let friendlyError = 'Failed to download TikTok video. ';
      
      if (errorMessage.includes('Access forbidden') || errorMessage.includes('insufficient permissions')) {
        friendlyError += 'The video appears to be restricted or private. ';
      } else if (errorMessage.includes('photo post')) {
        friendlyError += 'This appears to be a photo post. Please use the TikTok Photo tab instead. ';
      } else if (errorMessage.includes('Invalid TikTok URL')) {
        friendlyError += 'Please provide a valid TikTok video link. ';
      } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        friendlyError += 'The video was not found or may have been removed. ';
      } else if (errorMessage.includes('region') || errorMessage.includes('blocked')) {
        friendlyError += 'The video may be region-blocked or geo-restricted. ';
      } else if (errorMessage.includes('timeout') || errorMessage.includes('ECONNRESET')) {
        friendlyError += 'Connection timeout. Please try again in a moment. ';
      } else {
        friendlyError += 'This could be due to privacy settings, region restrictions, or anti-bot measures. ';
      }
      
      const debugInfo = {
        error: errorMessage,
        suggestions: [
          'Try a different TikTok video URL',
          'Check if the video is public and not region-restricted',
          'Verify the URL format is correct'
        ]
      };
      
      console.error('❌ TikTok download failed:', debugInfo);
      
      res.status(403).json({ 
        error: friendlyError,
        debug: process.env.NODE_ENV === 'development' ? debugInfo : undefined
      });
    }
    
  } catch (error) {
    console.error('❌ TikTok video download error:', error);
    res.status(500).json({ 
      error: 'Internal server error while processing TikTok video',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// TikTok photo download route
router.post('/tiktok/photo/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await tiktokPhotoService.fetchTikTokData(url);
    res.json(result);
  } catch (error) {
    console.error('TikTok photo download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download TikTok photos' });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
