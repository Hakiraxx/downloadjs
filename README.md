# Social Media Downloader

Một ứng dụng web hiện đại để tải video, ảnh và nhạc từ các nền tảng mạng xã hội phổ biến.

## 🚀 Deploy lên Hosting

### 1. Heroku
```bash
# Cài đặt Heroku CLI và đăng nhập
heroku login

# Tạo app mới
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 2. Railway
```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Đăng nhập và deploy
railway login
railway deploy
```

### 3. Render
1. Kết nối GitHub repo với Render
2. Chọn "Web Service"
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Set environment variables trong dashboard

### 4. VPS/Server
```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone và setup
git clone your-repo
cd your-repo
npm install
npm run build

# Sử dụng PM2
npm install -g pm2
pm2 start server.js --name "social-downloader"
pm2 startup
pm2 save
```

## 🔧 Environment Variables & Cách chạy

### 🏠 Chạy trên PC Local:

**Windows:**
```bash
# Cách 1: Dùng script tự động (Recommended)
start-local.bat

# Cách 2: Manual
npm install
npm run build
npm run start:local
```

**Linux/Mac:**
```bash
# Cách 1: Dùng script tự động (Recommended)
chmod +x start-local.sh
./start-local.sh

# Cách 2: Manual
npm install
npm run build
npm run start:local
```

**Development mode với auto-reload:**
```bash
npm run dev              # Chạy localhost:3001
npm run dev:network      # Chạy 0.0.0.0:3001 (có thể access từ điện thoại)
```

### ☁️ Deploy lên Hosting:

Hosting platforms sẽ **tự động detect** và chạy đúng mode:
- ✅ Heroku: Tự động set PORT và HOST
- ✅ Railway: Tự động detect platform  
- ✅ Render: Tự động config production
- ✅ Vercel: Tự động serverless mode

**Manual force hosting mode:**
```bash
npm run start:hosting    # Force hosting mode
```

### 📄 Environment Files:

**Local Development (.env.development):**
```env
NODE_ENV=development
PORT=3001
HOST=localhost
RATE_LIMIT_WINDOW_MS=300000
RATE_LIMIT_MAX_REQUESTS=200
```

**Production/Hosting (.env.production):**
```env
NODE_ENV=production
# PORT và HOST sẽ được auto-detect bởi hosting platform
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 🎯 Smart Detection:

Ứng dụng sẽ **tự động detect** environment:
- 🏠 **Local**: `localhost:3001` - dễ dàng develop và test
- ☁️ **Hosting**: `0.0.0.0:PORT` - tối ưu cho production
- 🔄 **Auto-switch**: Không cần config gì thêm!

## Tính năng

### 🎯 Các nền tảng được hỗ trợ:
- **Facebook**: Tải video và reels
- **Instagram**: Tải video, reels và ảnh (bao gồm carousel)
- **TikTok**: 
  - Video service: Tải video TikTok
  - Photo service: Tải ảnh TikTok (slideshow)
- **SoundCloud**: Xem thông tin track và tải nhạc

### ⚡ Đặc điểm:
- ✅ Giao diện đẹp, hiện đại, responsive
- ✅ Rate limiting để bảo vệ server
- ✅ Tách riêng services cho từng platform
- ✅ Support multiple media (carousel Instagram, TikTok photos)
- ✅ An toàn và dễ sử dụng
- ✅ Xử lý lỗi tốt với thông báo toast

## Cài đặt

### Prerequisites
- Node.js (v16 hoặc cao hơn)
- NPM hoặc Yarn
- FFmpeg (để xử lý audio SoundCloud)

### Bước 1: Clone và cài đặt dependencies
```bash
# Clone project
git clone <repository-url>
cd download

# Cài đặt dependencies cho server
npm install

# Cài đặt dependencies cho client
cd client
npm install
cd ..
```

### Bước 2: Cấu hình environment
```bash
# Copy file .env và chỉnh sửa theo nhu cầu
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FACEBOOK_COOKIE=your_facebook_cookie_here
INSTAGRAM_COOKIE=your_instagram_cookie_here
```

### Bước 3: Cấu hình cookies (tuỳ chọn)
Để tăng tính ổn định, bạn có thể thêm cookies:

1. **Instagram**: Thêm cookie vào file `cookie.txt` hoặc biến môi trường `INSTAGRAM_COOKIE`
2. **Facebook**: Thêm cookie vào biến môi trường `FACEBOOK_COOKIE`

### Bước 4: Build và chạy
```bash
# Build React app
npm run build

# Chạy production server
npm start

# Hoặc chạy development mode
npm run dev
```

## Sử dụng

1. Mở trình duyệt và truy cập `http://localhost:3001`
2. Chọn platform muốn sử dụng (Facebook, Instagram, TikTok, SoundCloud)
3. Với TikTok: Chọn service Video hoặc Photo
4. Với SoundCloud: Chọn Info (xem thông tin) hoặc Download (tải nhạc)
5. Dán URL và nhấn "Tải xuống"
6. Đợi kết quả và tải file

## API Endpoints

### Facebook
```
POST /api/facebook/download
Body: { "url": "https://www.facebook.com/reel/..." }
```

### Instagram
```
POST /api/instagram/download
Body: { "url": "https://www.instagram.com/p/..." }
```

### TikTok Video
```
POST /api/tiktok/video/download
Body: { "url": "https://www.tiktok.com/@user/video/..." }
```

### TikTok Photo
```
POST /api/tiktok/photo/download
Body: { "url": "https://www.tiktok.com/@user/photo/..." }
```

### SoundCloud Info
```
POST /api/soundcloud/info
Body: { "url": "https://soundcloud.com/artist/track" }
```

### SoundCloud Download
```
POST /api/soundcloud/download
Body: { "url": "https://soundcloud.com/artist/track" }
```

## Cấu trúc project

```
download/
├── server.js              # Main server file
├── package.json           # Server dependencies
├── .env                   # Environment variables
├── cookie.txt             # Instagram cookies
├── services/              # Business logic services
│   ├── facebookService.js
│   ├── instagramService.js
│   ├── tiktokVideoService.js
│   ├── tiktokPhotoService.js
│   └── soundcloudService.js
├── downloads/             # Downloaded files
│   └── soundcloud/
└── client/                # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── App.js         # Main React component
        └── index.js
```

## Rate Limiting

Ứng dụng có rate limiting mặc định:
- **Window**: 15 phút
- **Max requests**: 100 requests mỗi IP

Có thể điều chỉnh trong file `.env`.

## Lưu ý bảo mật

1. **Cookies**: Không share cookies publicly
2. **Rate limiting**: Đã được cấu hình để tránh spam
3. **Input validation**: Tất cả input đều được validate
4. **Error handling**: Không expose sensitive information

## Troubleshooting

### Lỗi thường gặp:

1. **"Failed to extract appId or mediaId"**: 
   - Kiểm tra URL Instagram có đúng format
   - Thêm cookie Instagram

2. **"No video URLs found"**:
   - Kiểm tra URL Facebook có đúng format
   - Thêm cookie Facebook mới (cookie cũ có thể đã hết hạn)
   - Thử URL từ desktop Facebook thay vì mobile
   - Đảm bảo post là public
   - Một số video có thể được bảo vệ bởi Facebook

3. **Facebook Cookie Setup**:
   ```bash
   # Để lấy cookie Facebook:
   # 1. Đăng nhập Facebook trên Chrome
   # 2. F12 -> Application -> Storage -> Cookies -> https://www.facebook.com
   # 3. Copy tất cả cookies
   # 4. Paste vào .env file hoặc thay thế trong facebookService.js
   ```

4. **FFmpeg errors**:
   - Cài đặt FFmpeg: https://ffmpeg.org/download.html
   - Restart ứng dụng sau khi cài đặt

5. **CORS errors**:
   - Kiểm tra proxy settings trong `client/package.json`

6. **Rate Limit Hit**:
   - Đợi 15 phút trước khi thử lại
   - Hoặc thay đổi RATE_LIMIT_MAX_REQUESTS trong .env

### Debug Tools:

```bash
# Test Facebook service riêng
node test-facebook.js

# Xem log chi tiết
npm run dev

# Check Facebook response (nếu có lỗi)
# File facebook_debug.html sẽ được tạo tự động
```

## Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Build React app
npm run build

# Install client dependencies
npm run install-client
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Disclaimer

Công cụ này chỉ dành cho mục đích giáo dục và nghiên cứu. Vui lòng tuân thủ các điều khoản sử dụng của từng nền tảng và tôn trọng bản quyền.
# downloadjs
