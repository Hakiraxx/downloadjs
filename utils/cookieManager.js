const fs = require('fs');
const path = require('path');

class CookieManager {
  constructor() {
    this.cookieFile = path.join(__dirname, 'cookies.json');
    this.loadCookies();
  }

  loadCookies() {
    try {
      if (fs.existsSync(this.cookieFile)) {
        this.cookies = JSON.parse(fs.readFileSync(this.cookieFile, 'utf-8'));
      } else {
        this.cookies = {
          facebook: process.env.FACEBOOK_COOKIE || '',
          instagram: process.env.INSTAGRAM_COOKIE || ''
        };
        this.saveCookies();
      }
    } catch (error) {
      console.error('Error loading cookies:', error);
      this.cookies = {
        facebook: '',
        instagram: ''
      };
    }
  }

  saveCookies() {
    try {
      fs.writeFileSync(this.cookieFile, JSON.stringify(this.cookies, null, 2));
    } catch (error) {
      console.error('Error saving cookies:', error);
    }
  }

  updateCookie(platform, cookie) {
    this.cookies[platform] = cookie;
    this.saveCookies();
    console.log(`✅ ${platform} cookie updated successfully`);
  }

  getCookie(platform) {
    return this.cookies[platform] || '';
  }

  // Method to validate cookie format
  validateCookie(platform, cookie) {
    const validations = {
      facebook: /c_user=\d+/,
      instagram: /sessionid=[a-zA-Z0-9%]+/
    };

    const validation = validations[platform];
    if (validation && !validation.test(cookie)) {
      throw new Error(`Invalid ${platform} cookie format`);
    }

    return true;
  }

  // Interactive cookie update
  async updateCookieInteractive(platform) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve, reject) => {
      rl.question(`Enter new ${platform} cookie: `, (cookie) => {
        try {
          this.validateCookie(platform, cookie);
          this.updateCookie(platform, cookie);
          rl.close();
          resolve(cookie);
        } catch (error) {
          rl.close();
          reject(error);
        }
      });
    });
  }
}

module.exports = new CookieManager();
