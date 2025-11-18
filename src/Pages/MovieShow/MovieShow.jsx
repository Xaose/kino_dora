import React from 'react';
import './MovieShow.css';
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
  ].filter(Boolean).join(' • ');

  return (
    <div className="movie-show-page">
      {loading && (
        <div className="movie-state">Загружаем данные фильма...</div>
      )}

      {!loading && error && (
        <div className="movie-state error">
          Не удалось загрузить фильм. <button onClick={handleBackToMovies}>Вернуться к списку</button>
        </div>
      )}

      {!loading && !movie && !error && (
        <div className="movie-state">
          Фильм не выбран. <button onClick={handleBackToMovies}>Открыть каталог</button>
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
                <div className="v2movie-meta">{infoItems || 'Информация уточняется'}</div>
                {movie.director && (
                  <div className="v2movie-meta v2movie-director">
                    Режиссёр: {movie.director}
                  </div>
                )}
              </div>

              <div className="v2likes-section">
                <div className="v2thumbs-buttons">
                  <div className="v2icon-pill">
                    <span>Возрастное ограничение</span>
                    <strong>{movie.ageRating ? `${movie.ageRating}+` : '—'}</strong>
                  </div>
                  <div className="v2icon-pill">
                    <span>Жанры</span>
                    <strong>{movie.genres?.join(', ') || '—'}</strong>
                  </div>
                </div>
              </div>

              <div className="v2action-buttons">
                <button className="v2btn-watch" onClick={handleWatch}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 9.42108C2.5 7.04419 5.04833 5.53744 7.131 6.6829L26.3653 17.2618C28.524 18.449 28.524 21.5509 26.3653 22.7381L7.13099 33.317C5.04833 34.4625 2.5 32.9557 2.5 30.5788V9.42108Z" fill="var(--color-text-primary)"/>
                  </svg>
                  Смотреть
                </button>
                {movie.trailerUrl && (
                  <a className="v2btn-overview" href={movie.trailerUrl} target="_blank" rel="noreferrer">
                    Трейлер
                  </a>
                )}
              </div>
            </div>

            <div className="v2gradient-bottom"></div>
          </div>

          <section className="v2about-section">
            <h2 className="v2section-title">Описание</h2>
            <p className="v2about-text">
              {movie.description || 'Добавьте описание фильма в базе данных, чтобы увидеть его здесь.'}
            </p>
          </section>

          <section className="v2genres-section">
            <h2 className="v2section-title-small">Жанры</h2>
            <div className="v2genre-tags">
              {movie.genres?.length
                ? movie.genres.map((genre) => (
                    <span key={genre} className="v2genre-tag">{genre}</span>
                  ))
                : <span className="v2genre-tag">Жанры не указаны</span>}
            </div>
          </section>

          <section className="v2characters-section">
            <h2 className="v2section-title-medium">Актёры</h2>
            <div className="v2characters-list">
              {movie.actors?.length
                ? movie.actors.map((actor) => (
                    <div key={actor} className="v2character-chip">{actor}</div>
                  ))
                : <div className="v2character-chip">Список актёров уточняется</div>}
            </div>
          </section>

          <section className="v2director-section">
            <h2 className="v2section-title-medium">Дополнительно</h2>
            <div className="v2info-grid">
              <div className="v2info-card">
                <span className="v2info-label">Режиссёр</span>
                <strong className="v2info-value">{movie.director || '—'}</strong>
              </div>
              <div className="v2info-card">
                <span className="v2info-label">Бюджет</span>
                <strong className="v2info-value">{movie.budget ? `${formatNumber(movie.budget)} $` : '—'}</strong>
              </div>
              <div className="v2info-card">
                <span className="v2info-label">Продолжительность</span>
                <strong className="v2info-value">{movie.runtime || '—'}</strong>
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
