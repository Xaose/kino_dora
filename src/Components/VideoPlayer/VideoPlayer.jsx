import { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';

// Функция для определения YouTube URL и извлечения video ID
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Функция для проверки, является ли URL YouTube ссылкой
const isYouTubeUrl = (url) => {
  return getYouTubeVideoId(url) !== null;
};

function VideoPlayer({ videoUrl, title, onBack, poster }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [previewTime, setPreviewTime] = useState(0);
  
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const isYouTube = isYouTubeUrl(videoUrl);
  const youtubeVideoId = isYouTube ? getYouTubeVideoId(videoUrl) : null;
  const youtubeEmbedUrl = youtubeVideoId 
    ? `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  useEffect(() => {
    // Пропускаем для YouTube видео (они используют iframe)
    if (isYouTube) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isYouTube]);

  useEffect(() => {
    if (showControls && isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const handlePlayerClick = () => {
    setShowControls(!showControls);
  };

  const handlePlayerMouseMove = () => {
    setShowControls(true);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleProgressHover = (e) => {
    const video = videoRef.current;
    if (!video || !progressBarRef.current || !showControls) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setPreviewPosition(pos);
    setPreviewTime(pos * video.duration);
    setShowPreview(true);
  };

  const handleProgressLeave = () => {
    setShowPreview(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00:00';
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Если это YouTube видео, используем iframe
  if (isYouTube && youtubeEmbedUrl) {
    return (
      <div 
        ref={playerRef}
        className="video-player video-player-youtube" 
      >
        <iframe
          className="video-element video-element-youtube"
          src={youtubeEmbedUrl}
          title={title || 'YouTube video player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
        <div className="player-controls visible">
          <div className="top-bar">
            <div className="top-bar-left">
              <button className="control-button back-button" onClick={onBack} aria-label="Back">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 24L12 16L20 8" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="video-title">{title || 'Название'}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Обычное видео
  return (
    <div 
      ref={playerRef}
      className="video-player" 
      onClick={handlePlayerClick}
      onMouseMove={handlePlayerMouseMove}
    >
      <video
        ref={videoRef}
        className="video-element"
        src={videoUrl}
        poster={poster || 'https://api.builder.io/api/v1/image/assets/TEMP/334ef8abada410832ddd7f42ed45740721299948?width=2880'}
        playsInline
      />

      <div className={`player-controls ${showControls ? 'visible' : ''}`}>
        <div className="top-bar">
          <div className="top-bar-left">
            <button className="control-button back-button" onClick={onBack} aria-label="Back">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 24L12 16L20 8" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="video-title">{title || 'Название'}</h1>
          </div>
          
          <div className="top-bar-right">
            <button className="control-button" aria-label="Share">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 10C25.6569 10 27 8.65685 27 7C27 5.34315 25.6569 4 24 4C22.3431 4 21 5.34315 21 7C21 8.65685 22.3431 10 24 10Z" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 19C9.65685 19 11 17.6569 11 16C11 14.3431 9.65685 13 8 13C6.34315 13 5 14.3431 5 16C5 17.6569 6.34315 19 8 19Z" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 28C25.6569 28 27 26.6569 27 25C27 23.3431 25.6569 22 24 22C22.3431 22 21 23.3431 21 25C21 26.6569 22.3431 28 24 28Z" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.6 17.6L21.4 23.4M21.4 8.6L10.6 14.4" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="control-button" aria-label="Cast">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="7" width="24" height="18" rx="2" stroke="var(--color-text-primary)" strokeWidth="1.5"/>
                <path d="M4 20C6.20914 20 8 21.7909 8 24M4 16C8.41828 16 12 19.5817 12 24M4 12C10.6274 12 16 17.3726 16 24" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button className="control-button" aria-label="Menu">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10H26M6 16H26M6 22H26" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button className="control-button" aria-label="Settings">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 20C18.2091 20 20 18.2091 20 16C20 13.7909 18.2091 12 16 12C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20Z" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25.8 20C25.6 20.5 25.8 21.1 26.3 21.4L26.4 21.5C26.8122 21.7122 27.1657 22.0157 27.4319 22.3858C27.698 22.7559 27.8692 23.1823 27.9317 23.6304C27.9942 24.0785 27.9464 24.5352 27.7923 24.9629C27.6382 25.3906 27.3821 25.7768 27.045 26.09C26.7079 26.4033 26.2992 26.6348 25.8523 26.7651C25.4053 26.8954 24.9328 26.921 24.4733 26.8395C24.0137 26.758 23.5802 26.5717 23.2069 26.2953C22.8337 26.0189 22.5311 25.6599 22.323 25.2465L22.2 25C21.9 24.5 21.3 24.3 20.8 24.5C20.3 24.7 20.1 25.3 20.3 25.8V25.9C20.6 27 20.3 28.2 19.6 29C18.9 29.8 17.8 30.3 16.7 30.3C15.6 30.3 14.5 29.9 13.8 29.1C13.1 28.3 12.8 27.2 13 26.1V26C13.2 25.5 12.9 24.9 12.4 24.7C11.9 24.5 11.3 24.7 11 25.2L10.9 25.3C10.6919 25.7134 10.3892 26.0724 10.016 26.3488C9.64271 26.6252 9.20919 26.8115 8.74965 26.893C8.29011 26.9745 7.81763 26.9489 7.37069 26.8186C6.92374 26.6883 6.51504 26.4568 6.17793 26.1435C5.84083 25.8303 5.58469 25.4441 5.43059 25.0164C5.27648 24.5887 5.22873 24.132 5.2912 23.6839C5.35367 23.2358 5.52489 22.8094 5.79102 22.4393C6.05716 22.0692 6.41063 21.7657 6.823 21.5535L6.9 21.5C7.4 21.3 7.6 20.7 7.4 20.2C7.2 19.7 6.6 19.5 6.1 19.7H6C4.9 19.4 3.7 19.7 2.9 20.4C2.1 21.1 1.6 22.2 1.6 23.3C1.6 24.4 2 25.5 2.8 26.2C3.6 26.9 4.7 27.2 5.8 27V27C6.3 26.8 6.9 27.1 7.1 27.6C7.3 28.1 7 28.7 6.5 28.9L6.4 29C5.98764 29.2122 5.63418 29.5157 5.36804 29.8858C5.10191 30.2559 4.93069 30.6823 4.86822 31.1304C4.80575 31.5785 4.8535 32.0352 5.00761 32.4629C5.16171 32.8906 5.41786 33.2768 5.75496 33.59C6.09207 33.9033 6.50077 34.1348 6.94771 34.2651C7.39466 34.3954 7.86714 34.421 8.32668 34.3395C8.78621 34.258 9.21973 34.0717 9.59302 33.7953C9.96631 33.5189 10.2689 33.1599 10.477 32.7465L10.6 32.5C10.8 32 11.4 31.8 11.9 32C12.4 32.2 12.6 32.8 12.4 33.3V33.4C12.1 34.5 12.4 35.7 13.1 36.5C13.8 37.3 14.9 37.8 16 37.8C17.1 37.8 18.2 37.4 18.9 36.6C19.6 35.8 19.9 34.7 19.7 33.6V33.5C19.5 33 19.8 32.4 20.3 32.2C20.8 32 21.4 32.3 21.6 32.8L21.7 32.9C21.9081 33.3134 22.2108 33.6724 22.584 33.9488C22.9573 34.2252 23.3908 34.4115 23.8504 34.493C24.3099 34.5745 24.7824 34.5489 25.2293 34.4186C25.6763 34.2883 26.085 34.0568 26.4221 33.7435C26.7592 33.4303 27.0153 33.0441 27.1694 32.6164C27.3235 32.1887 27.3713 31.732 27.3088 31.2839C27.2463 30.8358 27.0751 30.4094 26.809 30.0393C26.5428 29.6692 26.1894 29.3657 25.777 29.1535L25.7 29.1C25.2 28.9 25 28.3 25.2 27.8C25.4 27.3 26 27.1 26.5 27.3H26.6C27.7 27.6 28.9 27.3 29.7 26.6C30.5 25.9 31 24.8 31 23.7C31 22.6 30.6 21.5 29.8 20.8C29 20.1 27.9 19.8 26.8 20H26.6C26.1 20.2 25.5 19.9 25.3 19.4C25.1 18.9 25.4 18.3 25.9 18.1L26 18C26.4122 17.7878 26.7657 17.4843 27.0319 17.1142C27.298 16.7441 27.4692 16.3177 27.5317 15.8696C27.5942 15.4215 27.5464 14.9648 27.3923 14.5371C27.2382 14.1094 26.9821 13.7232 26.645 13.41C26.3079 13.0967 25.8992 12.8652 25.4523 12.7349C25.0053 12.6046 24.5328 12.579 24.0733 12.6605C23.6137 12.742 23.1802 12.9283 22.8069 13.2047C22.4337 13.4811 22.1311 13.8401 21.923 14.2535L21.8 14.5C21.6 15 21 15.2 20.5 15C20 14.8 19.8 14.2 20 13.7V13.6C20.3 12.5 20 11.3 19.3 10.5C18.6 9.7 17.5 9.2 16.4 9.2C15.3 9.2 14.2 9.6 13.5 10.4C12.8 11.2 12.5 12.3 12.7 13.4V13.5C12.9 14 12.6 14.6 12.1 14.8C11.6 15 11 14.7 10.8 14.2L10.7 14.1C10.4919 13.6866 10.1892 13.3276 9.81602 13.0512C9.44273 12.7748 9.00921 12.5885 8.54967 12.507C8.09013 12.4255 7.61765 12.4511 7.17071 12.5814C6.72376 12.7117 6.31506 12.9432 5.97795 13.2565C5.64085 13.5697 5.38471 13.9559 5.23061 14.3836C5.0765 14.8113 5.02875 15.268 5.09122 15.7161C5.15369 16.1642 5.32491 16.5906 5.59104 16.9607C5.85718 17.3308 6.21065 17.6343 6.62302 17.8465L6.7 17.9C7.2 18.1 7.4 18.7 7.2 19.2C7 19.7 6.4 19.9 5.9 19.7H5.8C4.7 19.4 3.5 19.7 2.7 20.4C1.9 21.1 1.4 22.2 1.4 23.3C1.4 24.4 1.8 25.5 2.6 26.2C3.4 26.9 4.5 27.2 5.6 27H5.8C6.3 26.8 6.9 27.1 7.1 27.6C7.3 28.1 7 28.7 6.5 28.9L6.4 29C5.98764 29.2122 5.63418 29.5157 5.36804 29.8858C5.10191 30.2559 4.93069 30.6823 4.86822 31.1304C4.80575 31.5785 4.8535 32.0352 5.00761 32.4629C5.16171 32.8906 5.41786 33.2768 5.75496 33.59C6.09207 33.9033 6.50077 34.1348 6.94771 34.2651C7.39466 34.3954 7.86714 34.421 8.32668 34.3395C8.78621 34.258 9.21973 34.0717 9.59302 33.7953C9.96631 33.5189 10.2689 33.1599 10.477 32.7465L10.6 32.5C10.8 32 11.4 31.8 11.9 32C12.4 32.2 12.6 32.8 12.4 33.3V33.4C12.1 34.5 12.4 35.7 13.1 36.5C13.8 37.3 14.9 37.8 16 37.8C17.1 37.8 18.2 37.4 18.9 36.6C19.6 35.8 19.9 34.7 19.7 33.6" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="center-controls">
          <button className="control-button skip-button" onClick={() => skipTime(-10)} aria-label="Rewind 10 seconds">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#228EE5" strokeWidth="2"/>
              <path d="M32 16V32L40 40" stroke="#228EE5" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 24C22.6667 20.6667 27.6 14 36 14" stroke="#228EE5" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 24V16M20 24H28" stroke="#228EE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="32" y="38" fill="#228EE5" fontSize="14" fontWeight="600" textAnchor="middle">10</text>
            </svg>
          </button>

          <button className="control-button play-button" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? (
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="24" y="20" width="10" height="40" rx="2" fill="#228EE5"/>
                <rect x="46" y="20" width="10" height="40" rx="2" fill="#228EE5"/>
              </svg>
            ) : (
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M28 20L60 40L28 60V20Z" fill="#228EE5"/>
              </svg>
            )}
          </button>

          <button className="control-button skip-button" onClick={() => skipTime(10)} aria-label="Forward 10 seconds">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="30" stroke="#228EE5" strokeWidth="2"/>
              <path d="M32 16V32L24 40" stroke="#228EE5" strokeWidth="2" strokeLinecap="round"/>
              <path d="M44 24C41.3333 20.6667 36.4 14 28 14" stroke="#228EE5" strokeWidth="2" strokeLinecap="round"/>
              <path d="M44 24V16M44 24H36" stroke="#228EE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <text x="32" y="38" fill="#228EE5" fontSize="14" fontWeight="600" textAnchor="middle">10</text>
            </svg>
          </button>
        </div>

        <div className="bottom-bar">
          <div 
            className={`preview-thumbnail ${showPreview && showControls ? 'visible' : ''}`}
            style={{ left: `${previewPosition * 100}%` }}
          >
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/334ef8abada410832ddd7f42ed45740721299948?width=400" 
              alt="Preview" 
            />
            <div className="preview-time">{formatTime(previewTime)}</div>
          </div>

          <div 
            ref={progressBarRef}
            className="progress-bar" 
            onClick={handleProgressChange}
            onMouseMove={handleProgressHover}
            onMouseLeave={handleProgressLeave}
          >
            <div className="progress-track">
              <div 
                className="progress-filled" 
                style={{ width: `${progress}%` }}
              >
                <div className="progress-handle"></div>
              </div>
            </div>
          </div>

          <div className="bottom-controls">
            <div className="bottom-controls-left">
              <button className="control-button volume-button" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10L14 14H10V18H14L18 22V10Z" fill="var(--color-text-primary)"/>
                    <path d="M24 14L28 18M28 14L24 18" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 10L14 14H10V18H14L18 22V10Z" fill="var(--color-text-primary)"/>
                    <path d="M22 14C22.6667 14.6667 24 16.4 24 18C24 19.6 22.6667 21.3333 22 22" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M25 11C26.3333 12.3333 29 15.6 29 18C29 20.4 26.3333 23.6667 25 25" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
              <span className="time-display">{formatTime(currentTime)}</span>
            </div>

            <div className="bottom-controls-right">
              <span className="time-display">{formatTime(duration)}</span>
              <button className="control-button fullscreen-button" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                {isFullscreen ? (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12H8M20 8V12H24M8 20H12V24M24 20H20V24" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8H12V12M24 8H20V12M12 24H8V20M20 24H24V20" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
