const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SoundCloudService {
  constructor() {
    this.clientId = 'gqKBMSuBw5rbN9rDRYPqKNvF17ovlObu';
    this.outputDir = './downloads/soundcloud';
    
    if (ffmpegPath) {
      ffmpeg.setFfmpegPath(ffmpegPath);
    }
    
    // Ensure download directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async getTrackInfo(trackUrl) {
    try {
      if (!trackUrl || !trackUrl.includes('soundcloud.com')) {
        throw new Error('Invalid SoundCloud URL');
      }

      const baseUrl = `https://api-widget.soundcloud.com/resolve?url=${trackUrl}&format=json&client_id=${this.clientId}&app_version=1746521262`;
      const response = await axios.get(baseUrl, { timeout: 30000 });
      const data = response.data;
      
      const timestamp = data['created_at'];
      const date = new Date(timestamp);
      const readableDate = date.toLocaleString('en-US', { timeZone: 'UTC' });
      
      return {
        success: true,
        platform: 'soundcloud',
        name: data['permalink'],
        title: data['title'] || data['permalink'],
        created_at: readableDate,
        description: data['description'],
        comment_count: data['comment_count'],
        artwork_url: data['artwork_url'],
        duration: data['duration'],
        genre: data['genre'],
        user: {
          username: data['user']?.username || '',
          full_name: data['user']?.full_name || '',
          avatar_url: data['user']?.avatar_url || ''
        }
      };
    } catch (error) {
      console.error('SoundCloud Info Error:', error);
      throw new Error(error.message || 'Failed to get SoundCloud track info');
    }
  }

  async downloadTrack(trackUrl) {
    try {
      if (!trackUrl || !trackUrl.includes('soundcloud.com')) {
        throw new Error('Invalid SoundCloud URL');
      }

      console.log('Resolving SoundCloud track...');
      const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${trackUrl}&client_id=${this.clientId}`;
      const resolveResponse = await axios.get(resolveUrl, { timeout: 30000 });
      const trackId = resolveResponse.data.id;
      const trackTitle = resolveResponse.data.title || 'untitled';

      console.log('Getting track media URLs...');
      const trackInfoUrl = `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${this.clientId}`;
      const trackInfoResponse = await axios.get(trackInfoUrl, { timeout: 30000 });
      const transcodings = trackInfoResponse.data.media.transcodings;

      const progressive = transcodings.find(t => t.format.protocol === 'progressive');
      const hls = transcodings.find(t => t.format.protocol === 'hls');
      const transcoding = progressive || hls;

      if (!transcoding) {
        throw new Error('No suitable media format found');
      }

      console.log('Getting stream URL...');
      const mediaUrlResponse = await axios.get(`${transcoding.url}?client_id=${this.clientId}`, { timeout: 30000 });
      const streamUrl = mediaUrlResponse.data.url;

      // Generate unique filename
      const safeTitle = trackTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
      const uniqueId = uuidv4().substring(0, 8);
      const outputFile = path.join(this.outputDir, `${safeTitle}_${uniqueId}.mp3`);

      console.log('Starting download...');
      
      return new Promise((resolve, reject) => {
        const command = ffmpeg()
          .input(streamUrl)
          .inputOption('-referer', 'https://soundcloud.com/')
          .inputOption('-reconnect', '1')
          .inputOption('-reconnect_streamed', '1')
          .inputOption('-reconnect_delay_max', '5')
          .audioBitrate('320k')
          .audioCodec('libmp3lame')
          .audioChannels(2)
          .outputOptions('-id3v2_version 3')
          .output(outputFile);

        command.on('start', commandLine => {
          console.log('▶️ Starting ffmpeg with command:', commandLine);
        });

        command.on('progress', progress => {
          if (progress.percent) {
            process.stdout.write(`⏳ Processing: ${Math.floor(progress.percent)}%\r`);
          } else if (progress.timemark) {
            process.stdout.write(`⏳ Time processed: ${progress.timemark}\r`);
          }
        });

        command.on('end', () => {
          console.log(`\n✅ Download complete: ${outputFile}`);
          resolve({
            success: true,
            platform: 'soundcloud',
            message: 'Download completed successfully',
            filename: path.basename(outputFile),
            path: outputFile
          });
        });

        command.on('error', err => {
          console.error(`\n❌ Error: ${err.message}`);
          reject(new Error(`Download failed: ${err.message}`));
        });

        command.run();
      });
    } catch (error) {
      console.error('SoundCloud Download Error:', error);
      throw new Error(error.message || 'Failed to download SoundCloud track');
    }
  }
}

module.exports = new SoundCloudService();
