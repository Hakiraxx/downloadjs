const fs = require('fs');
const path = require('path');
const config = require('../config/app');

// Auto cleanup old SoundCloud files
function cleanupOldSoundCloudFiles() {
  try {
    const soundcloudDir = path.join(__dirname, '..', 'downloads', 'soundcloud');
    
    if (!fs.existsSync(soundcloudDir)) {
      fs.mkdirSync(soundcloudDir, { recursive: true });
      return;
    }
    
    const files = fs.readdirSync(soundcloudDir);
    const now = Date.now();
    const maxAge = config.cleanup.soundCloudMaxAge;
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(soundcloudDir, file);
      try {
        const stats = fs.statSync(filePath);
        
        // Delete files older than 24 hours
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🗑️ Startup cleanup: deleted old file ${file}`);
        }
      } catch (err) {
        console.error(`❌ Error processing file ${file}:`, err);
      }
    });
    
    if (deletedCount > 0) {
      console.log(`✅ Startup cleanup completed: ${deletedCount} old files deleted`);
    }
  } catch (error) {
    console.error('❌ Startup cleanup error:', error);
  }
}

// Clean filename to be safe for filesystem
function sanitizeFilename(filename) {
  return filename.replace(/[<>:"/\\|?*]/g, '_');
}

// Generate download filename
function generateDownloadFilename(urlObj, type, format) {
  const urlPath = urlObj.pathname;
  let extension = type === 'video' ? 'mp4' : 'jpg'; // default extensions
  
  // Use format parameter if provided and valid
  if (format) {
    const validExtensions = config.validExtensions[type] || [];
    if (validExtensions.includes(format.toLowerCase())) {
      extension = format.toLowerCase();
      console.log(`📋 Using provided format: ${extension}`);
    }
  } else {
    // Try to get extension from URL path
    const pathExtension = urlPath.split('.').pop();
    const validExtensions = config.validExtensions[type] || [];
    
    if (pathExtension && pathExtension.length <= 4) {
      if (validExtensions.includes(pathExtension.toLowerCase())) {
        extension = pathExtension.toLowerCase();
      }
    }
    
    // Special handling for TikTok videos (fallback)
    if (urlObj.hostname.includes('tiktok') || urlObj.hostname.includes('muscdn') || urlObj.hostname.includes('bytecdn')) {
      if (type === 'video') {
        if (urlPath.includes('.webm')) {
          extension = 'webm';
        } else if (urlPath.includes('.ts')) {
          extension = 'ts';
        } else if (urlPath.includes('.m4v')) {
          extension = 'm4v';
        } else {
          extension = 'mp4'; // fallback
        }
      }
    }
  }
  
  const timestamp = Date.now();
  let filename;
  
  if (type === 'video') {
    filename = `video_${timestamp}.${extension}`;
  } else if (type === 'image') {
    filename = `image_${timestamp}.${extension}`;
  } else {
    filename = `download_${timestamp}.${extension}`;
  }
  
  console.log(`📁 Generated filename: ${filename} (detected extension: ${extension})`);
  return filename;
}

// Check if domain is allowed
function isDomainAllowed(hostname, allowedDomains) {
  return allowedDomains.some(domain => hostname.includes(domain));
}

module.exports = {
  cleanupOldSoundCloudFiles,
  sanitizeFilename,
  generateDownloadFilename,
  isDomainAllowed
};
