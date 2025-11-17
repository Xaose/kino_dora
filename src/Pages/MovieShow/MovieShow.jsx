import React from 'react';
import './MovieShow.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useMovie } from '../../hooks/useMovie';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';

function MovieShow({ onNavigate, selectedMovieId }) {
  const { movie, loading, error } = useMovie(selectedMovieId);
  const poster = movie?.posterUrl || POSTER_PLACEHOLDER;

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return numberValue.toLocaleString('ru-RU');
  };

  const handleWatch = () => {
    if (onNavigate && movie?.id) {
      onNavigate('playing', null, { movieId: movie.id });
    }
  };

  const handleBackToMovies = () => {
    onNavigate?.('movies');
  };

  const infoItems = [
    movie?.releaseYear && `${movie.releaseYear}`,
    movie?.runtime && movie.runtime,
    movie?.ageRating && `${movie.ageRating}+`,
    movie?.budget && `${formatNumber(movie.budget)} $`
  ].filter(Boolean).join(' вЂў ');

  return (
    <div className="movie-show-page">
      <Header onNavigate={onNavigate} />

      {loading && (
        <div className="movie-state">Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ С„РёР»СЊРјР°...</div>
      )}

      {!loading && error && (
        <div className="movie-state error">
          РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РёР»СЊРј. <button onClick={handleBackToMovies}>Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє СЃРїРёСЃРєСѓ</button>
        </div>
      )}

      {!loading && !movie && !error && (
        <div className="movie-state">
          Р¤РёР»СЊРј РЅРµ РІС‹Р±СЂР°РЅ. <button onClick={handleBackToMovies}>РћС‚РєСЂС‹С‚СЊ РєР°С‚Р°Р»РѕРі</button>
        </div>
      )}

      {movie && (
        <>
          <div className="v2hero-banner">
            <img
              className="v2hero-image"
              src={poster}
              alt={movie.title}
            />
            <div className="v2hero-gradient-blur"></div>

            <div className="v2hero-content">
              <div className="v2movie-info">
                <h1 className="v2movie-title">{movie.title}</h1>
                <div className="v2movie-meta">{infoItems || 'РРЅС„РѕСЂРјР°С†РёСЏ СѓС‚РѕС‡РЅСЏРµС‚СЃСЏ'}</div>
                {movie.director && (
                  <div className="v2movie-meta v2movie-director">
                    Р РµР¶РёСЃСЃС‘СЂ: {movie.director}
                  </div>
                )}
              </div>

              <div className="v2likes-section">
                <div className="v2thumbs-buttons">
                  <div className="v2icon-pill">
                    <span>Р’РѕР·СЂР°СЃС‚РЅРѕРµ РѕРіСЂР°РЅРёС‡РµРЅРёРµ</span>
                    <strong>{movie.ageRating ? `${movie.ageRating}+` : 'вЂ”'}</strong>
                  </div>
                  <div className="v2icon-pill">
                    <span>Р–Р°РЅСЂС‹</span>
                    <strong>{movie.genres?.join(', ') || 'вЂ”'}</strong>
                  </div>
                </div>
              </div>

              <div className="v2action-buttons">
                <button className="v2btn-watch" onClick={handleWatch}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 9.42108C2.5 7.04419 5.04833 5.53744 7.131 6.6829L26.3653 17.2618C28.524 18.449 28.524 21.5509 26.3653 22.7381L7.13099 33.317C5.04833 34.4625 2.5 32.9557 2.5 30.5788V9.42108Z" fill="var(--color-text-primary)"/>
                  </svg>
                  РЎРјРѕС‚СЂРµС‚СЊ
                </button>
                {movie.trailerUrl && (
                  <a className="v2btn-overview" href={movie.trailerUrl} target="_blank" rel="noreferrer">
                    РўСЂРµР№Р»РµСЂ
                  </a>
                )}
              </div>
            </div>

            <div className="v2gradient-bottom"></div>
          </div>

          <section className="v2about-section">
            <h2 className="v2section-title">РћРїРёСЃР°РЅРёРµ</h2>
            <p className="v2about-text">
              {movie.description || 'Р”РѕР±Р°РІСЊС‚Рµ РѕРїРёСЃР°РЅРёРµ С„РёР»СЊРјР° РІ Р±Р°Р·Рµ РґР°РЅРЅС‹С…, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РµРіРѕ Р·РґРµСЃСЊ.'}
            </p>
          </section>

          <section className="v2genres-section">
            <h2 className="v2section-title-small">Р–Р°РЅСЂС‹</h2>
            <div className="v2genre-tags">
              {movie.genres?.length
                ? movie.genres.map((genre) => (
                    <span key={genre} className="v2genre-tag">{genre}</span>
                  ))
                : <span className="v2genre-tag">Р–Р°РЅСЂС‹ РЅРµ СѓРєР°Р·Р°РЅС‹</span>}
            </div>
          </section>

          <section className="v2characters-section">
            <h2 className="v2section-title-medium">РђРєС‚С‘СЂС‹</h2>
            <div className="v2characters-list">
              {movie.actors?.length
                ? movie.actors.map((actor) => (
                    <div key={actor} className="v2character-chip">{actor}</div>
                  ))
                : <div className="v2character-chip">РЎРїРёСЃРѕРє Р°РєС‚С‘СЂРѕРІ СѓС‚РѕС‡РЅСЏРµС‚СЃСЏ</div>}
            </div>
          </section>

          <section className="v2director-section">
            <h2 className="v2section-title-medium">Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ</h2>
            <div className="v2info-grid">
              <div className="v2info-card">
                <span className="v2info-label">Р РµР¶РёСЃСЃС‘СЂ</span>
                <strong className="v2info-value">{movie.director || 'вЂ”'}</strong>
              </div>
              <div className="v2info-card">
                <span className="v2info-label">Р‘СЋРґР¶РµС‚</span>
                <strong className="v2info-value">{movie.budget ? `${formatNumber(movie.budget)} $` : 'вЂ”'}</strong>
              </div>
              <div className="v2info-card">
                <span className="v2info-label">РџСЂРѕРґРѕР»Р¶РёС‚РµР»СЊРЅРѕСЃС‚СЊ</span>
                <strong className="v2info-value">{movie.runtime || 'вЂ”'}</strong>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default MovieShow;
