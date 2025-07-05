const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/app');
const { isDomainAllowed, generateDownloadFilename, sanitizeFilename } = require('../utils/helpers');

// Image proxy endpoint to bypass CORS
router.get('/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    const urlObj = new URL(url);
    const isAllowed = isDomainAllowed(urlObj.hostname, config.imageProxyDomains);
    
    if (!isAllowed) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }
    
    // Determine platform and set appropriate headers for image fetching
    let imageHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    };
    
    // Platform-specific headers for images
    if (urlObj.hostname.includes('tiktokcdn.com')) {
      imageHeaders.Referer = 'https://www.tiktok.com/';
      imageHeaders['Sec-Fetch-Site'] = 'same-site';
    } else if (urlObj.hostname.includes('cdninstagram.com') || urlObj.hostname.includes('instagram.com')) {
      imageHeaders.Referer = 'https://www.instagram.com/';
      imageHeaders['X-Instagram-AJAX'] = '1';
    } else if (urlObj.hostname.includes('fbcdn.net')) {
      imageHeaders.Referer = 'https://www.facebook.com/';
    } else if (urlObj.hostname.includes('sndcdn.com')) {
      imageHeaders.Referer = 'https://soundcloud.com/';
    }
    
    // Fetch image with appropriate headers
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: imageHeaders,
      timeout: 10000
    });
    
    // Set appropriate headers
    res.set({
      'Content-Type': response.headers['content-type'] || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Access-Control-Allow-Origin': '*'
    });
    
    response.data.pipe(res);
    
  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Download endpoint to force file download
router.get('/download', async (req, res) => {
  try {
    const { url, filename, type, format } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    const urlObj = new URL(url);
    console.log(`🔍 Checking domain: ${urlObj.hostname} for URL: ${url}`);
    
    const isAllowed = isDomainAllowed(urlObj.hostname, config.allowedDomains);
    console.log(`✅ Domain allowed: ${isAllowed}`);
    
    if (!isAllowed) {
      console.log(`❌ Domain ${urlObj.hostname} not in allowed list`);
      return res.status(403).json({ 
        error: 'Domain not allowed', 
        domain: urlObj.hostname,
        allowedDomains: config.allowedDomains 
      });
    }
    
    // Generate filename if not provided
    let downloadFilename = filename || generateDownloadFilename(urlObj, type, format);
    downloadFilename = sanitizeFilename(downloadFilename);
    
    console.log(`🔽 Starting download: ${downloadFilename} from ${url}`);
    
    // Determine platform and set appropriate headers
    let headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': type === 'video' ? 'video' : 'image',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site'
    };
    
    // Platform-specific headers
    if (urlObj.hostname.includes('tiktokcdn.com') || urlObj.hostname.includes('muscdn.com') || url.includes('tiktok.com')) {
      // TikTok specific headers
      headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Referer': 'https://www.tiktok.com/',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9',
    'Priority': 'u=0, i',
    'Sec-Ch-Ua': '"Chromium";v="125", "Google Chrome";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Range': 'bytes=0-'
};
    } else if (urlObj.hostname.includes('cdninstagram.com') || urlObj.hostname.includes('instagram.com')) {
      // Instagram specific headers
      headers = {
        ...headers,
        'Referer': 'https://www.instagram.com/',
        'X-Instagram-AJAX': '1',
        'X-Requested-With': 'XMLHttpRequest'
      };
    } else if (urlObj.hostname.includes('fbcdn.net')) {
      // Facebook specific headers
      headers = {
        ...headers,
        'Referer': 'https://www.facebook.com/',
        'Sec-Fetch-Site': 'same-site'
      };
    } else if (urlObj.hostname.includes('sndcdn.com')) {
      // SoundCloud specific headers
      headers = {
        ...headers,
        'Referer': 'https://soundcloud.com/',
        'Origin': 'https://soundcloud.com'
      };
    }
    
    // Fetch file with appropriate headers
    const response = await axios.get(url, {
      responseType: 'stream',
      headers,
    });
    // Set headers to force download
    res.set({
      'Content-Type': response.headers['content-type'] || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${downloadFilename}"`,
      'Content-Length': response.headers['content-length'],
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Disposition'
    });
    
    // Pipe the response directly to client
    response.data.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download stream error' });
      }
    });
    
    response.data.pipe(res);
    
    console.log(`✅ Download started successfully: ${downloadFilename}`);
    
  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download file: ' + error.message });
    }
  }
});

module.exports = router;
