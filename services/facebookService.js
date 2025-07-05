const axios = require('axios');
const fs = require('fs');

class FacebookService {
  constructor() {
    this.headers = {
      "sec-fetch-user": "?1",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-site": "none",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "cache-control": "max-age=0",
      authority: "www.facebook.com",
      cookie: process.env.FACEBOOK_COOKIE || "sb=r-xhaENagjlXyHthXQFGUwkQ; datr=r-xhaNx5jrmGV89dr9eFgypF; ps_l=1; ps_n=1; dpr=1.25; c_user=100091773840498; ar_debug=1; fr=1K60aTZZvYCvgLdNU.AWcw6I8HD5ScE3m-NVmswxt75vWIPzgoMqmLvoJwLIjdioC2PLs.BoaBcp..AAA.0.0.BoaBcp.AWcz5kOaoI2McjxKe2vH3lFMuwU; xs=15%3Aj1MYCErG1EOrkQ%3A2%3A1751250803%3A-1%3A-1%3A%3AAcUClTeJJ-N1s7puLAxCvsbdGdHRUaDlcTftc1mtK0A; presence=C%7B%22lm3%22%3A%22cg.7027534834014048%22%2C%22lm3p%22%3A%222279676092375598%22%2C%22t3%22%3A%5B%5D%2C%22utc3%22%3A1751652144843%2C%22v%22%3A1%7D; wd=786x738", // ⚠️ Never share this publicly || Paste your cookie here to use it !
      "upgrade-insecure-requests": "1",
      "accept-language": "en-GB,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,en-US;q=0.6",
      "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    };
  }

  async getVideo(url) {
    return new Promise((resolve, reject) => {
      if (!url || !url.includes('facebook.com')) {
        return reject(new Error('Invalid Facebook URL'));
      }

      axios({
        method: 'GET',
        url: url,
        headers: this.headers,
        timeout: 30000
      }).then((rawResponse) => {
        try {
          const data = rawResponse.data;
          console.log('🔍 Facebook response received, length:', data.length);
          
          // Extract video URLs
          const match = data.match(/"progressive_urls":\s*(\[[\s\S]*?\])/);
          if (!match) {
            console.log('❌ No progressive_urls found, trying alternative patterns...');
            
            // Try alternative patterns
            const altPatterns = [
              /"playable_url":"([^"]*(?:\\.[^"]*)*)"/g,
              /"browser_native_hd_url":"([^"]*(?:\\.[^"]*)*)"/g,
              /"browser_native_sd_url":"([^"]*(?:\\.[^"]*)*)"/g
            ];
            
            let foundVideos = [];
            for (const pattern of altPatterns) {
              let match;
              while ((match = pattern.exec(data)) !== null) {
                const cleanUrl = match[1].replace(/\\\//g, '/').replace(/\\u0025/g, '%');
                foundVideos.push({
                  url: cleanUrl,
                  quality: pattern.toString().includes('hd') ? 'HD' : 'SD'
                });
              }
            }
            
            if (foundVideos.length === 0) {
              return reject(new Error("No video URLs found! This might be a private video or the URL format is not supported."));
            }
            
            // Remove duplicates
            foundVideos = foundVideos.filter((video, index, self) => 
              index === self.findIndex(v => v.url === video.url)
            );
            
          } else {
            console.log('✅ Found progressive_urls');
          }
          
          let urlsWithMetadata = [];
          if (match) {
            const progressiveArray = JSON.parse(match[1]);
            urlsWithMetadata = progressiveArray.map(item => ({
              url: item.progressive_url,
              quality: item.metadata ? item.metadata.quality : 'Unknown'
            }));
          } else {
            urlsWithMetadata = foundVideos;
          }
          
          let title = 'No title found';
          const allMessageMatches = data.match(/"message":\s*{\s*"text":\s*"([^"]*(?:\\.[^"]*)*)"/g);
          
          if (allMessageMatches && allMessageMatches.length > 0) {
            let bestMatch = '';
            let maxLength = 0;
            
            for (let match of allMessageMatches) {
              const textMatch = match.match(/"text":\s*"([^"]*(?:\\.[^"]*)*)"/);
              if (textMatch && textMatch[1].length > maxLength) {
                if (textMatch[1].length > 20) {
                  bestMatch = textMatch[1];
                  maxLength = textMatch[1].length;
                }
              }
            }
            
            if (bestMatch) {
              title = bestMatch
                .replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => String.fromCharCode(parseInt(code, 16)))
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            }
          }
          
          // Extract cover/thumbnail image with improved patterns
          let coverUrl = null;
          const coverPatterns = [
            // High quality patterns
            /"preferred_thumbnail":\s*{\s*"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            /"thumbnailImage":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            /"cover_photo":\s*{\s*"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            
            // Video specific patterns
            /"videoStoryAttachment":\s*{[^}]*"media":\s*{[^}]*"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            /"video_attachment":\s*{[^}]*"media":\s*{[^}]*"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            
            // General patterns
            /"cover_image_url":"([^"]*(?:\\.[^"]*)*)"/,
            /"thumbnail":"([^"]*(?:\\.[^"]*)*)"/,
            /"preview_image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/,
            /"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"[^}]*"height":\s*\d{3,}/,
            /"image":\s*{\s*"uri":"([^"]*(?:\\.[^"]*)*)"/
          ];
          
          console.log('🔍 Searching for cover image...');
          for (let i = 0; i < coverPatterns.length; i++) {
            const pattern = coverPatterns[i];
            const match = data.match(pattern);
            if (match && match[1]) {
              const rawUrl = match[1];
              coverUrl = rawUrl
                .replace(/\\u0025/g, '%')
                .replace(/\\\//g, '/')
                .replace(/\\u0026/g, '&')
                .replace(/\\"/g, '"');
              
              console.log(`✅ Found cover with pattern ${i + 1}: ${coverUrl.substring(0, 100)}...`);
              
              // Validate URL format
              if (coverUrl.includes('fbcdn.net') && (coverUrl.includes('.jpg') || coverUrl.includes('.png'))) {
                break;
              } else {
                console.log(`⚠️ Pattern ${i + 1} URL format invalid, trying next...`);
                coverUrl = null;
              }
            }
          }
          
          if (!coverUrl) {
            console.log('❌ No valid cover image found');
          }
          
          resolve({
            success: true,
            platform: 'facebook',
            type: 'video', // Thêm trường type
            title: title,
            cover: coverUrl,
            videos: urlsWithMetadata,
            downloadUrl: urlsWithMetadata[0]?.url || null
          });
        } catch (err) {
          reject(err);
        }
      }).catch(reject);
    });
  }
}

module.exports = new FacebookService();
