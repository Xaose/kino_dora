import React from 'react';
import VideoPlayer from '../../Components/VideoPlayer/VideoPlayer';
import { useMedia } from '../../hooks/useMedia';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import './Playing.css';

function Playing({ onNavigate, selectedMovieId, mediaType = 'movie' }) {
  const { movie, loading, error } = useMedia(selectedMovieId, mediaType);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('movieshow', null, { movieId: selectedMovieId, type: mediaType });
    }
  };

  if (loading) {
    return <div className="playing-page movie-state">Загружаем плеер...</div>;
  }

  if (error || !movie) {
    return (
      <div className="playing-page movie-state error">
        Не удалось загрузить видео.
        <button onClick={handleBack}>Назад</button>
      </div>
    );
  }

  const videoSource = movie.videoUrl || movie.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return (
    <div className="playing-page">
      <VideoPlayer
        videoUrl={videoSource}
        title={movie.title}
        poster={movie.posterUrl || POSTER_PLACEHOLDER}
        onBack={handleBack}
      />
    </div>
  );
}

export default Playing;
