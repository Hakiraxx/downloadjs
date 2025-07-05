const axios = require('axios');
const fs = require('fs');

class InstagramService {
  constructor() {
    this.cookietxt = process.env.INSTAGRAM_COOKIE || fs.readFileSync('cookie.txt', 'utf-8').catch(() => '');
  }

  async getAppID(url) {
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.2592.87',
        'sec-fetch-mode': 'navigate',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'cookie': this.cookietxt
      };

      const r1 = (regex, str) => {
        const match = str.match(regex);
        return match ? match[1] : null;
      };

      url = r1(/([^?]*)/, url) || url;
      const response = await axios.get(url, { headers, timeout: 30000 });
      const content = response.data;
      
      const appId = r1(/"appId":"(\d+)"/, content);
      const mediaId = r1(/"media_id":"(\d+)"/, content) || r1(/"id":"(\d+_\d+)"/, content);
      
      if (!appId || !mediaId) {
        throw new Error("Failed to extract appId or mediaId from the Instagram page");
      }
      
      return { appId, mediaId };
    } catch (error) {
      throw error;
    }
  }

  async downloadAnyoneInInsta(link) {
    try {
      if (!link || !link.includes('instagram.com')) {
        throw new Error('Invalid Instagram URL');
      }

      const { appId, mediaId } = await this.getAppID(link);
      const mediaUrl = `https://i.instagram.com/api/v1/media/${mediaId}/info/`;
      
      const mediaCheck = await axios.get(mediaUrl, {
        headers: {
          'X-IG-App-ID': appId,
          'Cookie': this.cookietxt,
        },
        timeout: 30000
      });

      const data = mediaCheck.data;
      const item = data.items[0];
      
      const result = {
        success: true,
        platform: 'instagram',
        title: item.caption ? item.caption.text : '',
        user: item.caption ? {
          full_name: item.caption.user.full_name,
          username: item.caption.user.username
        } : {},
        media: []
      };

      if (item.carousel_media && item.carousel_media.length > 0) {
        // Multiple media (carousel)
        for (let i = 0; i < item.carousel_media.length; i++) {
          const mediaItem = item.carousel_media[i];
          const mediaObj = { index: i };
          
          if (mediaItem.image_versions2 && mediaItem.image_versions2.candidates && mediaItem.image_versions2.candidates.length > 0) {
            mediaObj.type = 'image';
            mediaObj.url = mediaItem.image_versions2.candidates[0].url;
          }
          
          if (mediaItem.video_versions && mediaItem.video_versions.length > 0) {
            mediaObj.type = 'video';
            mediaObj.url = mediaItem.video_versions[0].url;
            
            if (mediaItem.image_versions2 && mediaItem.image_versions2.candidates && mediaItem.image_versions2.candidates.length > 0) {
              mediaObj.thumbnail = mediaItem.image_versions2.candidates[0].url;
            }
          }
          result.media.push(mediaObj);
        }
      } else {
        // Single media
        const mediaObj = {};
        
        if (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates.length > 0) {
          mediaObj.type = 'image';
          mediaObj.url = item.image_versions2.candidates[0].url;
        }
        
        if (item.video_versions && item.video_versions.length > 0) {
          mediaObj.type = 'video';
          mediaObj.url = item.video_versions[0].url;
          
          if (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates.length > 0) {
            mediaObj.thumbnail = item.image_versions2.candidates[0].url;
          }
        }
        result.media.push(mediaObj);
      }
      
      return result;
    } catch (error) {
      console.error('Instagram Service Error:', error);
      throw new Error(error.message || 'Failed to process Instagram content');
    }
  }
}

module.exports = new InstagramService();
