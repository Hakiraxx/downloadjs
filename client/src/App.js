import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { toast } from 'react-toastify';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaSoundcloud,
  FaDownload,
  FaLink,
  FaCog,
  FaImage,
  FaVideo,
  FaMusic
} from 'react-icons/fa';
import axios from 'axios';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
`;

const MainCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
`;

const PlatformTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const InputSection = styled.div`
  margin-bottom: 30px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ServiceTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const ServiceTab = styled.button`
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#667eea' : '#f8f9fa'};
  }
`;

const ResultSection = styled.div`
  margin-top: 30px;
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
`;

const ResultTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #333;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MediaItem = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const MediaImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const DownloadButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  margin: 5px;

  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }
`;

const DownloadDirectButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.disabled ? '#6c757d' : '#007bff'};
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin: 5px;

  &:hover {
    background: ${props => props.disabled ? '#6c757d' : '#0056b3'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-1px)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, placeholder: 'https://www.facebook.com/reel/...' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, placeholder: 'https://www.instagram.com/p/...' },
  { id: 'tiktok', name: 'TikTok', icon: FaTiktok, placeholder: 'https://www.tiktok.com/@user/video/...' },
  { id: 'soundcloud', name: 'SoundCloud', icon: FaSoundcloud, placeholder: 'https://soundcloud.com/artist/track' }
];

const tiktokServices = [
  { id: 'video', name: 'Video', icon: FaVideo },
  { id: 'photo', name: 'Photo', icon: FaImage }
];

const soundcloudServices = [
  { id: 'info', name: 'Info', icon: FaCog },
  { id: 'download', name: 'Download', icon: FaDownload }
];

function App() {
  const [activePlatform, setActivePlatform] = useState('facebook');
  const [activeService, setActiveService] = useState('video');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [downloading, setDownloading] = useState(false);

  // Helper function to get proxied image URL for Instagram/TikTok
  const getProxiedImageUrl = (imageUrl, platform) => {
    if (!imageUrl) return '';
    
    // Use proxy for Instagram and TikTok to bypass CORS
    if (platform === 'instagram' || platform === 'tiktok') {
      return `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }
    
    // Facebook images work directly
    return imageUrl;
  };

  // Helper function to download file directly
  const downloadDirect = async (fileUrl, type, quality = '', customTitle = '', videoFormat = '') => {
    if (downloading) {
      toast.warning('Đang có tải xuống khác, vui lòng chờ...');
      return;
    }
    
    setDownloading(true);
    
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      
      // Generate meaningful filename based on platform and content
      let filename = '';
      
      // Clean title for filename (remove special characters)
      const cleanTitle = customTitle ? 
        customTitle.replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_').slice(0, 50) : '';
      
      if (activePlatform === 'facebook') {
        filename = cleanTitle ? 
          `Facebook_${cleanTitle}_${quality}_${timestamp}` : 
          `Facebook_${type}_${quality}_${timestamp}`;
      } else if (activePlatform === 'instagram') {
        filename = cleanTitle ? 
          `Instagram_${cleanTitle}_${quality}_${timestamp}` : 
          `Instagram_${type}_${quality}_${timestamp}`;
      } else if (activePlatform === 'tiktok') {
        filename = cleanTitle ? 
          `TikTok_${cleanTitle}_${quality}_${timestamp}` : 
          `TikTok_${type}_${quality}_${timestamp}`;
      } else if (activePlatform === 'soundcloud') {
        filename = cleanTitle ? 
          `SoundCloud_${cleanTitle}_${timestamp}` : 
          `SoundCloud_${type}_${timestamp}`;
      } else {
        filename = `${type}_${quality}_${timestamp}`;
      }
      
      // Get file extension from URL with better detection
      const urlObj = new URL(fileUrl);
      const urlPath = urlObj.pathname;
      let extension = type === 'video' ? 'mp4' : 'jpg'; // default
      
      // Use videoFormat if provided (from TikTok service)
      if (videoFormat && type === 'video') {
        const validVideoExts = ['mp4', 'webm', 'ts', 'm4v', 'mov', 'avi', 'mkv', 'flv'];
        if (validVideoExts.includes(videoFormat.toLowerCase())) {
          extension = videoFormat.toLowerCase();
          console.log(`🎬 Using videoFormat from service: ${extension}`);
        }
      } else {
        // Try to get extension from URL path
        const pathParts = urlPath.split('.');
        if (pathParts.length > 1) {
          const detectedExt = pathParts.pop().toLowerCase();
          
          // Valid extensions for each type
          const validVideoExts = ['mp4', 'webm', 'ts', 'm4v', 'mov', 'avi', 'mkv', 'flv'];
          const validImageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
          
          if (type === 'video' && validVideoExts.includes(detectedExt)) {
            extension = detectedExt;
          } else if (type === 'image' && validImageExts.includes(detectedExt)) {
            extension = detectedExt;
          }
        }
        
        // Special handling for TikTok URLs (fallback)
        if (activePlatform === 'tiktok' && type === 'video') {
          if (urlPath.includes('.webm')) {
            extension = 'webm';
          } else if (urlPath.includes('.ts')) {
            extension = 'ts';
          } else if (urlPath.includes('.m4v')) {
            extension = 'm4v';
          }
        }
      }
      
      console.log(`📁 Using extension: ${extension} for ${type}`);
      
      const finalFilename = `${filename}.${extension}`;
      let downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(finalFilename)}&type=${type}`;
      
      // Add format parameter if using custom format (mainly for TikTok)
      if (videoFormat && type === 'video') {
        downloadUrl += `&format=${encodeURIComponent(videoFormat)}`;
      }
      
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`🚀 Bắt đầu tải ${type} (${extension}) từ ${activePlatform}...`);
      
      // Reset downloading state after a short delay
      setTimeout(() => {
        setDownloading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Có lỗi khi tải file!');
      setDownloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Vui lòng nhập URL!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let endpoint = '';
      
      switch (activePlatform) {
        case 'facebook':
          endpoint = '/api/facebook/download';
          break;
        case 'instagram':
          endpoint = '/api/instagram/download';
          break;
        case 'tiktok':
          endpoint = activeService === 'video' ? '/api/tiktok/video/download' : '/api/tiktok/photo/download';
          break;
        case 'soundcloud':
          endpoint = activeService === 'info' ? '/api/soundcloud/info' : '/api/soundcloud/download';
          break;
        default:
          throw new Error('Platform không được hỗ trợ');
      }

      const response = await axios.post(endpoint, { url });
      console.log('🔍 Full Response received:', response.data); // Debug log
      console.log('🔍 Response status:', response.status); // Debug status
      console.log('🔍 Response headers:', response.headers); // Debug headers
      setResult(response.data);
      toast.success('Thành công!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <ResultSection>
        <ResultCard>
          <ResultTitle>{result.title || 'Kết quả'}</ResultTitle>
          
          {result.user && (
            <p><strong>Người đăng:</strong> {result.user.full_name || result.user.username}</p>
          )}
          
          {result.author && (
            <p><strong>Tác giả:</strong> {result.author.nickname || result.author.username}</p>
          )}

          {/* Facebook Video/Image */}
          {result.platform === 'facebook' && (
            <div style={{ marginTop: '15px' }}>
              {/* Facebook Videos */}
              {result.videos && result.videos.length > 0 && (
                <MediaGrid>
                  {result.videos.map((video, index) => (
                    <MediaItem key={index}>
                      {result.cover && (
                        <MediaImage src={result.cover} alt={`Facebook Video Preview`} />
                      )}
                      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <strong>Chất lượng: {video.quality}</strong>
                      </div>
                      <ButtonGroup>
                        <DownloadButton href={video.url} target="_blank" rel="noopener noreferrer">
                          <FaVideo /> Xem video
                        </DownloadButton>
                        <DownloadDirectButton 
                          onClick={() => downloadDirect(video.url, 'video', video.quality, result.title)}
                          disabled={downloading}
                        >
                          {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                          {downloading ? 'Đang tải...' : 'Tải xuống'}
                        </DownloadDirectButton>
                      </ButtonGroup>
                    </MediaItem>
                  ))}
                </MediaGrid>
              )}

              {/* Facebook Images if available */}
              {result.images && result.images.length > 0 && (
                <MediaGrid>
                  {result.images.map((item, index) => (
                    <MediaItem key={index}>
                      <MediaImage src={item.url} alt={`Facebook Image ${index + 1}`} />
                      <ButtonGroup>
                        <DownloadButton href={item.url} target="_blank" rel="noopener noreferrer">
                          <FaImage /> Xem ảnh
                        </DownloadButton>
                        <DownloadDirectButton 
                          onClick={() => downloadDirect(item.url, 'image', `img${index + 1}`, result.title)}
                          disabled={downloading}
                        >
                          {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                          {downloading ? 'Đang tải...' : 'Tải xuống'}
                        </DownloadDirectButton>
                      </ButtonGroup>
                    </MediaItem>
                  ))}
                </MediaGrid>
              )}

              {/* Fallback if no videos or images */}
              {(!result.videos || result.videos.length === 0) && (!result.images || result.images.length === 0) && (
                <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px', color: '#856404' }}>
                  ⚠️ Không tìm thấy video hoặc ảnh để tải về. Kiểm tra lại URL hoặc thử lại sau.
                </div>
              )}
            </div>
          )}

          {/* Instagram Media */}
          {result.platform === 'instagram' && result.media && (
            <MediaGrid>
              {result.media.map((item, index) => (
                <MediaItem key={index}>
                  {item.type === 'image' && (
                    <>
                      <MediaImage src={getProxiedImageUrl(item.url, 'instagram')} alt={`Media ${index + 1}`} />
                      <ButtonGroup>
                        <DownloadButton href={item.url} target="_blank" rel="noopener noreferrer">
                          <FaImage /> Xem ảnh
                        </DownloadButton>
                        <DownloadDirectButton 
                          onClick={() => downloadDirect(item.url, 'image', `instagram_${index + 1}`, result.title)}
                          disabled={downloading}
                        >
                          {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                          {downloading ? 'Đang tải...' : 'Tải xuống'}
                        </DownloadDirectButton>
                      </ButtonGroup>
                    </>
                  )}
                  {item.type === 'video' && (
                    <>
                      {item.thumbnail && <MediaImage src={getProxiedImageUrl(item.thumbnail, 'instagram')} alt={`Video ${index + 1}`} />}
                      <ButtonGroup>
                        <DownloadButton href={item.url} target="_blank" rel="noopener noreferrer">
                          <FaVideo /> Xem video
                        </DownloadButton>
                        <DownloadDirectButton 
                          onClick={() => downloadDirect(item.url, 'video', `instagram_video_${index + 1}`, result.title)}
                          disabled={downloading}
                        >
                          {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                          {downloading ? 'Đang tải...' : 'Tải xuống'}
                        </DownloadDirectButton>
                      </ButtonGroup>
                    </>
                  )}
                </MediaItem>
              ))}
            </MediaGrid>
          )}

          {/* TikTok Video */}
          {result.platform === 'tiktok' && result.type === 'video' && result.videoUrl && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <ButtonGroup>
                <DownloadButton href={result.videoUrl} target="_blank" rel="noopener noreferrer">
                  <FaVideo /> Xem video TikTok
                </DownloadButton>
                <DownloadDirectButton 
                  onClick={() => downloadDirect(result.videoUrl, 'video', 'tiktok_video', result.title, result.videoFormat)}
                  disabled={downloading}
                >
                  {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                  {downloading ? 'Đang tải...' : `Tải xuống${result.videoFormat ? ` (${result.videoFormat.toUpperCase()})` : ''}`}
                </DownloadDirectButton>
              </ButtonGroup>
            </div>
          )}

          {/* TikTok Photos */}
          {result.platform === 'tiktok' && result.type === 'photo' && result.images && (
            <MediaGrid>
              {result.images.map((item) => (
                <MediaItem key={item.id}>
                  <MediaImage src={getProxiedImageUrl(item.url, 'tiktok')} alt={`Photo ${item.id}`} />
                  <ButtonGroup>
                    <DownloadButton href={item.url} target="_blank" rel="noopener noreferrer">
                      <FaImage /> Xem ảnh
                    </DownloadButton>
                    <DownloadDirectButton 
                      onClick={() => downloadDirect(item.url, 'image', `tiktok_photo_${item.id}`, result.title)}
                      disabled={downloading}
                    >
                      {downloading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                      {downloading ? 'Đang tải...' : 'Tải xuống'}
                    </DownloadDirectButton>
                  </ButtonGroup>
                </MediaItem>
              ))}
            </MediaGrid>
          )}

          {/* SoundCloud */}
          {result.platform === 'soundcloud' && (
            <div style={{ marginTop: '15px' }}>
              {result.artwork_url && <MediaImage src={result.artwork_url} alt="Album art" style={{ maxWidth: '200px' }} />}
              {result.user && <p><strong>Nghệ sĩ:</strong> {result.user.username}</p>}
              {result.duration && <p><strong>Thời lượng:</strong> {Math.floor(result.duration / 1000 / 60)}:{Math.floor((result.duration / 1000) % 60).toString().padStart(2, '0')}</p>}
              {result.message && <p style={{ color: 'green', fontWeight: 'bold' }}>{result.message}</p>}
              
              {/* Download button for SoundCloud */}
              {!result.message && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <ButtonGroup>
                    <DownloadDirectButton 
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const response = await fetch('/api/soundcloud/download', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ url: url }),
                          });
                          
                          if (response.ok) {
                            // Get filename from Content-Disposition header
                            const contentDisposition = response.headers.get('Content-Disposition');
                            let filename = 'soundcloud_track.mp3';
                            if (contentDisposition) {
                              const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
                              if (filenameMatch) {
                                filename = filenameMatch[1];
                              }
                            }
                            
                            // Create blob from response
                            const blob = await response.blob();
                            
                            // Create download link and trigger download
                            const downloadUrl = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(downloadUrl);
                            
                            toast.success(`🎵 Tải SoundCloud thành công! ${filename}`);
                            // Update result to show download completion
                            setResult(prev => ({
                              ...prev,
                              message: 'Download completed successfully',
                              filename: filename
                            }));
                          } else {
                            const errorData = await response.json();
                            toast.error(`Có lỗi khi tải nhạc SoundCloud: ${errorData.error || 'Unknown error'}`);
                          }
                        } catch (error) {
                          console.error('SoundCloud download error:', error);
                          toast.error('Có lỗi khi tải nhạc SoundCloud!');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner style={{width: '16px', height: '16px'}} /> : <FaDownload />} 
                      {loading ? 'Đang tải...' : 'Tải nhạc (MP3)'}
                    </DownloadDirectButton>
                  </ButtonGroup>
                </div>
              )}
              
              {/* Show completion message after successful download */}
              {result.message && (
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <p style={{ color: 'green', fontWeight: 'bold' }}>
                    ✅ {result.message} {result.filename && `(${result.filename})`}
                  </p>
                </div>
              )}
            </div>
          )}
        </ResultCard>
      </ResultSection>
    );
  };

  const currentPlatform = platforms.find(p => p.id === activePlatform);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <Title>Social Media Downloader</Title>
          <Subtitle>Tải video, ảnh và nhạc từ các mạng xã hội một cách dễ dàng</Subtitle>
        </Header>

        <MainCard>
          <PlatformTabs>
            {platforms.map(platform => {
              const Icon = platform.icon;
              return (
                <Tab
                  key={platform.id}
                  active={activePlatform === platform.id}
                  onClick={() => {
                    setActivePlatform(platform.id);
                    setResult(null);
                    if (platform.id === 'tiktok') setActiveService('video');
                    if (platform.id === 'soundcloud') setActiveService('info');
                  }}
                >
                  <Icon /> {platform.name}
                </Tab>
              );
            })}
          </PlatformTabs>

          {activePlatform === 'tiktok' && (
            <ServiceTabs>
              {tiktokServices.map(service => {
                const Icon = service.icon;
                return (
                  <ServiceTab
                    key={service.id}
                    active={activeService === service.id}
                    onClick={() => {
                      setActiveService(service.id);
                      setResult(null);
                    }}
                  >
                    <Icon style={{ marginRight: '5px' }} /> {service.name}
                  </ServiceTab>
                );
              })}
            </ServiceTabs>
          )}

          {activePlatform === 'soundcloud' && (
            <ServiceTabs>
              {soundcloudServices.map(service => {
                const Icon = service.icon;
                return (
                  <ServiceTab
                    key={service.id}
                    active={activeService === service.id}
                    onClick={() => {
                      setActiveService(service.id);
                      setResult(null);
                    }}
                  >
                    <Icon style={{ marginRight: '5px' }} /> {service.name}
                  </ServiceTab>
                );
              })}
            </ServiceTabs>
          )}

          <form onSubmit={handleSubmit}>
            <InputSection>
              <InputGroup>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={currentPlatform?.placeholder}
                  disabled={loading}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? <LoadingSpinner /> : <FaLink />}
                  {loading ? 'Đang xử lý...' : 'Tải xuống'}
                </Button>
              </InputGroup>
            </InputSection>
          </form>

          {renderResult()}
        </MainCard>
      </Container>
    </>
  );
}

export default App;
