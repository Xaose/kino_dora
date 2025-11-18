import { useState } from 'react';
import { uploadMovieVideo, uploadMoviePoster } from '../../Backend/storageService';
import './VideoUploader.css';

/**
 * Компонент для загрузки видео и постеров в Firebase Storage
 * Используется в админ-панели для добавления контента
 */
function VideoUploader({ movieId, onVideoUploaded, onPosterUploaded }) {
  const [videoFile, setVideoFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [posterProgress, setPosterProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Выберите видео файл');
        return;
      }
      setVideoFile(file);
      setError('');
    }
  };

  const handlePosterSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Выберите изображение');
        return;
      }
      setPosterFile(file);
      setError('');
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !movieId) {
      setError('Выберите видео файл и укажите ID фильма');
      return;
    }

    setLoading(true);
    setError('');
    setVideoProgress(0);

    try {
      const url = await uploadMovieVideo(
        videoFile,
        movieId,
        (progress) => {
          setVideoProgress(progress);
        }
      );
      
      setVideoUrl(url);
      if (onVideoUploaded) {
        onVideoUploaded(url);
      }
    } catch (err) {
      setError(`Ошибка загрузки видео: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePosterUpload = async () => {
    if (!posterFile || !movieId) {
      setError('Выберите изображение и укажите ID фильма');
      return;
    }

    setLoading(true);
    setError('');
    setPosterProgress(0);

    try {
      const url = await uploadMoviePoster(
        posterFile,
        movieId,
        (progress) => {
          setPosterProgress(progress);
        }
      );
      
      setPosterUrl(url);
      if (onPosterUploaded) {
        onPosterUploaded(url);
      }
    } catch (err) {
      setError(`Ошибка загрузки постера: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="video-uploader">
      <h3>Загрузка контента для фильма: {movieId || 'Не указан'}</h3>
      
      {error && <div className="upload-error">{error}</div>}

      {/* Загрузка видео */}
      <div className="upload-section">
        <h4>Видео</h4>
        <div className="upload-controls">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            disabled={loading}
            className="file-input"
          />
          {videoFile && (
            <div className="file-info">
              <span>{videoFile.name}</span>
              <span className="file-size">({formatFileSize(videoFile.size)})</span>
            </div>
          )}
          <button
            onClick={handleVideoUpload}
            disabled={!videoFile || loading || !movieId}
            className="upload-button"
          >
            Загрузить видео
          </button>
        </div>
        {videoProgress > 0 && videoProgress < 100 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${videoProgress}%` }}
            >
              {Math.round(videoProgress)}%
            </div>
          </div>
        )}
        {videoUrl && (
          <div className="upload-success">
            <p>Видео загружено!</p>
            <input
              type="text"
              value={videoUrl}
              readOnly
              className="url-input"
              onClick={(e) => e.target.select()}
            />
          </div>
        )}
      </div>

      {/* Загрузка постера */}
      <div className="upload-section">
        <h4>Постер</h4>
        <div className="upload-controls">
          <input
            type="file"
            accept="image/*"
            onChange={handlePosterSelect}
            disabled={loading}
            className="file-input"
          />
          {posterFile && (
            <div className="file-info">
              <span>{posterFile.name}</span>
              <span className="file-size">({formatFileSize(posterFile.size)})</span>
            </div>
          )}
          <button
            onClick={handlePosterUpload}
            disabled={!posterFile || loading || !movieId}
            className="upload-button"
          >
            Загрузить постер
          </button>
        </div>
        {posterProgress > 0 && posterProgress < 100 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${posterProgress}%` }}
            >
              {Math.round(posterProgress)}%
            </div>
          </div>
        )}
        {posterUrl && (
          <div className="upload-success">
            <p>Постер загружен!</p>
            <input
              type="text"
              value={posterUrl}
              readOnly
              className="url-input"
              onClick={(e) => e.target.select()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoUploader;

