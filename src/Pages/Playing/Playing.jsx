import React from 'react';
import VideoPlayer from '../../Components/VideoPlayer/VideoPlayer';
import { useMovie } from '../../hooks/useMovie';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import './Playing.css';

function Playing({ onNavigate, selectedMovieId }) {
  const { movie, loading, error } = useMovie(selectedMovieId);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('movieshow');
    }
  };

  if (loading) {
    return <div className="playing-page movie-state">Р—Р°РіСЂСѓР¶Р°РµРј РїР»РµРµСЂ...</div>;
  }

  if (error || !movie) {
    return (
      <div className="playing-page movie-state error">
        РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РІРёРґРµРѕ.
        <button onClick={handleBack}>РќР°Р·Р°Рґ</button>
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
