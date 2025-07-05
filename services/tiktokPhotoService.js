const xbogus = require('xbogus');
const axios = require('axios');
const cheerio = require('cheerio');

class TikTokPhotoService {
  constructor() {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Referer': 'https://www.tiktok.com/',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    };
  }

  async fetchTikTokData(link) {
    try {
      if (!link || !link.includes('tiktok.com')) {
        throw new Error('Invalid TikTok URL');
      }

      // Check if it's a video URL (should use video service instead)
      if (link.includes('/video/')) {
        throw new Error('This appears to be a TikTok video post. Please use the TikTok Video service instead.');
      }

      console.log(`🔍 Fetching TikTok photo page: ${link}`);

      const response = await axios.get(encodeURI(link), {
        headers: this.defaultHeaders,
        timeout: 30000,
        maxRedirects: 5
      });

      const html = response.data;
      const $ = cheerio.load(html);
      const scriptContent = $('script#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
      
      if (!scriptContent) {
        throw new Error('Could not find photo data in page');
      }

      const jsonData = JSON.parse(scriptContent);
      const data = jsonData.__DEFAULT_SCOPE__['webapp.app-context'];
      const WebIdLastTime = data.webIdCreatedTime;
      const odinId = data.odinId;
      const seoAbtest = jsonData.__DEFAULT_SCOPE__['seo.abtest'];
      const canonical = seoAbtest?.canonical || '';
      const itemId = canonical.split('/photo/')[1];

      if (!itemId) {
        throw new Error('Could not extract item ID from URL');
      }

      const cookies = response.headers['set-cookie'] || [];
      const msToken = cookies.find(c => c.startsWith('msToken='))?.split(';')[0].split('=')[1] || '';

      const queryParams = {
        WebIdLastTime,
        aid: "1988",
        app_language: "en-GB",
        app_name: "tiktok_web",
        browser_language: "en-GB",
        browser_name: "Mozilla",
        browser_online: "true",
        browser_platform: "Win32",
        browser_version: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
        channel: "tiktok_web",
        clientABVersions: "73675307",
        cookie_enabled: "true",
        coverFormat: "2",
        data_collection_enabled: "true",
        device_id: "7481132268917294600",
        device_platform: "web_pc",
        focus_state: "true",
        from_page: "user",
        history_len: "1",
        is_fullscreen: "false",
        is_page_visible: "true",
        itemId: itemId,
        language: "en-GB",
        odinId: odinId,
        os: "windows",
        priority_region: "",
        referer: "",
        region: "VN",
        screen_height: "864",
        screen_width: "1536",
        tz_name: "Asia/Saigon",
        user_is_login: "false",
        webcast_language: "en-GB"
      };

      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        searchParams.append(key, value);
      }

      const baseUrl = `https://www.tiktok.com/api/item/detail/?${searchParams.toString()}`;
      const xBogus = xbogus(baseUrl, queryParams.browser_version);
      searchParams.append('X-Bogus', xBogus);
      const finalUrl = `https://www.tiktok.com/api/item/detail/?${searchParams.toString()}`;

      const cookieHeader = `msToken=${msToken}; ${cookies.map(c => c.split(';')[0]).join('; ')}`;

      console.log(`🔄 Making API request to TikTok...`);

      const result = await axios.get(finalUrl, {
        headers: {
          'User-Agent': queryParams.browser_version,
          'cookie': cookieHeader,
          'accept-language': 'en-GB,en;q=0.9',
          'accept': 'application/json, text/plain, */*',
          'referer': 'https://www.tiktok.com/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin'
        },
        timeout: 30000
      });

      const dataResponse = result.data;
      
      if (!dataResponse.itemInfo || !dataResponse.itemInfo.itemStruct) {
        throw new Error('Invalid API response structure');
      }

      const itemStruct = dataResponse.itemInfo.itemStruct;
      const title = itemStruct.desc || 'TikTok Photo';
      const cover = itemStruct.video?.cover || '';
      const musicCover = itemStruct.music?.coverLarge || '';
      const musicPlayUrl = itemStruct.music?.playUrl || '';
      const images = itemStruct.imagePost?.images || [];
      const author = itemStruct.author || {};

      const imageUrls = images.map((image, index) => ({
        id: index + 1,
        url: image.imageURL.urlList[0]
      }));

      console.log(`✅ Successfully extracted ${imageUrls.length} images`);

      return {
        success: true,
        platform: 'tiktok',
        type: 'photo',
        title,
        cover,
        musicCover,
        musicPlayUrl,
        images: imageUrls,
        author: {
          username: author.uniqueId || '',
          nickname: author.nickname || '',
          avatar: author.avatarMedium || ''
        }
      };
    } catch (error) {
      console.error('TikTok Photo Service Error:', error);
      throw new Error(error.message || 'Failed to process TikTok photos');
    }
  }
}

module.exports = new TikTokPhotoService();
