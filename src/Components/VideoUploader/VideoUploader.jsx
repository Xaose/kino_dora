import { useState } from 'react';
import { uploadMovieVideo, uploadMoviePoster } from '../../Backend/storageService';
import './VideoUploader.css';

/**
 * РљРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ Р·Р°РіСЂСѓР·РєРё РІРёРґРµРѕ Рё РїРѕСЃС‚РµСЂРѕРІ РІ Firebase Storage
 * РСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ РІ Р°РґРјРёРЅ-РїР°РЅРµР»Рё РґР»СЏ РґРѕР±Р°РІР»РµРЅРёСЏ РєРѕРЅС‚РµРЅС‚Р°
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
        setError('Р’С‹Р±РµСЂРёС‚Рµ РІРёРґРµРѕ С„Р°Р№Р»');
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
        setError('Р’С‹Р±РµСЂРёС‚Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ');
        return;
      }
      setPosterFile(file);
      setError('');
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile || !movieId) {
      setError('Р’С‹Р±РµСЂРёС‚Рµ РІРёРґРµРѕ С„Р°Р№Р» Рё СѓРєР°Р¶РёС‚Рµ ID С„РёР»СЊРјР°');
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
      setError(`РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РІРёРґРµРѕ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePosterUpload = async () => {
    if (!posterFile || !movieId) {
      setError('Р’С‹Р±РµСЂРёС‚Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ Рё СѓРєР°Р¶РёС‚Рµ ID С„РёР»СЊРјР°');
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
      setError(`РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РїРѕСЃС‚РµСЂР°: ${err.message}`);
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
      <h3>Р—Р°РіСЂСѓР·РєР° РєРѕРЅС‚РµРЅС‚Р° РґР»СЏ С„РёР»СЊРјР°: {movieId || 'РќРµ СѓРєР°Р·Р°РЅ'}</h3>
      
      {error && <div className="upload-error">{error}</div>}

      {/* Р—Р°РіСЂСѓР·РєР° РІРёРґРµРѕ */}
      <div className="upload-section">
        <h4>Р’РёРґРµРѕ</h4>
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
            Р—Р°РіСЂСѓР·РёС‚СЊ РІРёРґРµРѕ
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
            <p>Р’РёРґРµРѕ Р·Р°РіСЂСѓР¶РµРЅРѕ!</p>
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

      {/* Р—Р°РіСЂСѓР·РєР° РїРѕСЃС‚РµСЂР° */}
      <div className="upload-section">
        <h4>РџРѕСЃС‚РµСЂ</h4>
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
            Р—Р°РіСЂСѓР·РёС‚СЊ РїРѕСЃС‚РµСЂ
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
            <p>РџРѕСЃС‚РµСЂ Р·Р°РіСЂСѓР¶РµРЅ!</p>
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

