const axios = require('axios');

class TikTokBackupService {
  constructor() {
    this.apiEndpoints = [
      'https://api.tiklydown.eu.org/api/download',
      'https://tikwm.com/api/',
      'https://api.tiktokv.com/aweme/v1/feed/',
    ];
  }

  async downloadVideo(url) {
    console.log('🔄 Using TikTok Backup Service...');
    
    // Method 1: TiklyDown API
    try {
      const result = await this.tryTiklyDown(url);
      if (result) return result;
    } catch (error) {
      console.log('TiklyDown failed:', error.message);
    }

    // Method 2: TikWM API
    try {
      const result = await this.tryTikWM(url);
      if (result) return result;
    } catch (error) {
      console.log('TikWM failed:', error.message);
    }

    throw new Error('All backup methods failed');
  }

  async tryTiklyDown(url) {
    try {
      const response = await axios.post('https://api.tiklydown.eu.org/api/download', {
        url: url
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      if (response.data && response.data.video && response.data.video.noWatermark) {
        return {
          success: true,
          platform: 'tiktok',
          type: 'video',
          title: response.data.title || 'TikTok Video',
          videoUrl: response.data.video.noWatermark,
          cover: response.data.cover || '',
          author: {
            username: response.data.author?.unique_id || '',
            nickname: response.data.author?.nickname || '',
            avatar: response.data.author?.avatar || ''
          },
          source: 'tiktok'
        };
      }
      throw new Error('Invalid response from TiklyDown');
    } catch (error) {
      throw new Error(`TiklyDown API error: ${error.message}`);
    }
  }

  async tryTikWM(url) {
    try {
      const response = await axios.post('https://tikwm.com/api/', {
        url: url,
        hd: 1
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 15000
      });

      if (response.data && response.data.code === 0 && response.data.data) {
        const data = response.data.data;
        return {
          success: true,
          platform: 'tiktok',
          type: 'video',
          title: data.title || 'TikTok Video',
          videoUrl: data.hdplay || data.play,
          cover: data.cover || '',
          author: {
            username: data.author?.unique_id || '',
            nickname: data.author?.nickname || '',
            avatar: data.author?.avatar || ''
          },
          source: 'tiktok'
        };
      }
      throw new Error('Invalid response from TikWM');
    } catch (error) {
      throw new Error(`TikWM API error: ${error.message}`);
    }
  }

  async tryDirectDownload(videoUrl) {
    // Thử download trực tiếp với headers TikTok
    try {
      const response = await axios.head(videoUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Referer': 'https://www.tiktok.com/',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Range': 'bytes=0-1023' // Test với small range
        },
        timeout: 10000
      });

      if (response.status === 206 || response.status === 200) {
        return { accessible: true, contentLength: response.headers['content-length'] };
      }
      return { accessible: false, error: `HTTP ${response.status}` };
    } catch (error) {
      return { accessible: false, error: error.message };
    }
  }
}

module.exports = new TikTokBackupService();
