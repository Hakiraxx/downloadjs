const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Import services
const soundcloudService = require('../services/soundcloudService');
const config = require('../config/app');

// SoundCloud info route
router.post('/info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await soundcloudService.getTrackInfo(url);
    res.json(result);
  } catch (error) {
    console.error('SoundCloud info error:', error);
    res.status(500).json({ error: error.message || 'Failed to get SoundCloud track info' });
  }
});

// SoundCloud download route
router.post('/download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Download track and get file info
    const result = await soundcloudService.downloadTrack(url);
    
    if (result.success && result.filename && result.path) {
      // Check if file exists
      if (!fs.existsSync(result.path)) {
        return res.status(404).json({ error: 'Downloaded file not found' });
      }

      // Set headers for direct download
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      console.log(`📁 Sending SoundCloud file directly: ${result.filename}`);
      
      // Send file and delete immediately after
      res.sendFile(path.resolve(result.path), (err) => {
        if (err) {
          console.error('Error sending file:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to send file' });
          }
        } else {
          console.log(`✅ File sent successfully: ${result.filename}`);
        }
        
        // Delete file regardless of success or failure
        setTimeout(() => {
          fs.unlink(result.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`❌ Failed to delete file ${result.filename}:`, unlinkErr);
            } else {
              console.log(`🗑️ Successfully deleted file after download: ${result.filename}`);
            }
          });
        }, 1000);
      });
    } else {
      res.status(500).json({ error: 'Download failed or file not created' });
    }
  } catch (error) {
    console.error('SoundCloud download error:', error);
    res.status(500).json({ error: error.message || 'Failed to download SoundCloud track' });
  }
});

// SoundCloud file download endpoint
router.get('/file/:filename', (req, res) => {
  try {
    const filename = decodeURIComponent(req.params.filename);
    const soundcloudDir = path.join(__dirname, '..', 'downloads', 'soundcloud');
    const filePath = path.join(soundcloudDir, filename);
    
    // Security check: ensure file is within soundcloud directory
    const normalizedPath = path.normalize(filePath);
    const normalizedDir = path.normalize(soundcloudDir);
    
    if (!normalizedPath.startsWith(normalizedDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set headers for download
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    console.log(`📁 Serving SoundCloud file: ${filename}`);
    
    // Send file and delete after successful download
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to send file' });
        }
      } else {
        // File sent successfully, now delete it
        setTimeout(() => {
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`❌ Failed to delete file ${filename}:`, unlinkErr);
            } else {
              console.log(`🗑️ Successfully deleted file: ${filename}`);
            }
          });
        }, 1000); // Small delay to ensure download completes
      }
    });
    
  } catch (error) {
    console.error('SoundCloud file serve error:', error);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// Cleanup old SoundCloud files (admin endpoint)
router.post('/cleanup', (req, res) => {
  try {
    const soundcloudDir = path.join(__dirname, '..', 'downloads', 'soundcloud');
    
    if (!fs.existsSync(soundcloudDir)) {
      return res.json({ message: 'SoundCloud directory does not exist', deleted: 0 });
    }
    
    const files = fs.readdirSync(soundcloudDir);
    const now = Date.now();
    const maxAge = config.cleanup.soundCloudMaxAge;
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(soundcloudDir, file);
      const stats = fs.statSync(filePath);
      
      // Delete files older than 24 hours
      if (now - stats.mtime.getTime() > maxAge) {
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🗑️ Cleaned up old file: ${file}`);
        } catch (err) {
          console.error(`❌ Failed to delete old file ${file}:`, err);
        }
      }
    });
    
    res.json({ 
      message: 'Cleanup completed', 
      deleted: deletedCount,
      remaining: files.length - deletedCount
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to cleanup files' });
  }
});

module.exports = router;
