import React, { useEffect, useState } from 'react';
import './MovieShow.css';
import Footer from '../../Components/Footer/Footer';
import { useMedia } from '../../hooks/useMedia';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import { commentsService } from '../../Backend/database';
import { getCurrentUser, onAuthStateChange } from '../../Backend/authService';

function MovieShow({ onNavigate, selectedMovieId, mediaType = 'movie' }) {
  const { movie, loading, error } = useMedia(selectedMovieId, mediaType);
  const poster = movie?.posterUrl || POSTER_PLACEHOLDER;
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitError, setCommentSubmitError] = useState('');
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) return value;
    return numberValue.toLocaleString('ru-RU');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!movie?.id) {
      setComments([]);
      return;
    }
    const loadComments = async () => {
      setCommentsLoading(true);
      setCommentsError('');
      try {
        const result = await commentsService.getByMovie(movie.id, mediaType);
        setComments(result);
      } catch (err) {
        console.error('Ошибка загрузки комментариев:', err);
        setCommentsError('Не удалось загрузить комментарии');
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [movie?.id, mediaType]);

  const handleWatch = () => {
    if (onNavigate && movie?.id) {
      onNavigate('playing', null, { movieId: movie.id, type: mediaType });
    }
  };

  const handleBackToMovies = () => {
    if (mediaType === 'dorama') {
      onNavigate?.('serials');
    } else {
      onNavigate?.('movies');
    }
  };

  const infoItems = [
    movie?.releaseYear && `${movie.releaseYear}`,
    movie?.runtime && movie.runtime,
    movie?.ageRating && `${movie.ageRating}+`,
    movie?.budget && `${formatNumber(movie.budget)} $`
  ].filter(Boolean).join(' • ');

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!movie?.id) return;

    if (!currentUser) {
      setCommentSubmitError('Войдите в аккаунт, чтобы оставлять комментарии');
      return;
    }

    const text = commentText.trim();
    if (!text) {
      setCommentSubmitError('Комментарий не может быть пустым');
      return;
    }

    try {
      setIsSendingComment(true);
      setCommentSubmitError('');
      const displayName =
        currentUser.name ||
        currentUser.username ||
        currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        'Пользователь';

      const newComment = await commentsService.add({
        movieId: movie.id,
        mediaType,
        userId: currentUser.uid,
        userName: displayName,
        text
      });

      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Ошибка отправки комментария:', err);
      setCommentSubmitError('Не удалось отправить комментарий. Попробуйте позже.');
    } finally {
      setIsSendingComment(false);
    }
  };

  const formatCommentDate = (dateValue) => {
    if (!dateValue) return '';
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="movie-show-page">
      {loading && (
        <div className="movie-state">Загружаем данные {mediaType === 'dorama' ? 'дорамы' : 'фильма'}...</div>
      )}

      {!loading && error && (
        <div className="movie-state error">
          Не удалось загрузить {mediaType === 'dorama' ? 'дораму' : 'фильм'}. <button onClick={handleBackToMovies}>Вернуться к списку</button>
        </div>
      )}

      {!loading && !movie && !error && (
        <div className="movie-state">
          {mediaType === 'dorama' ? 'Дорама' : 'Фильм'} не выбран. <button onClick={handleBackToMovies}>Открыть каталог</button>
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
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 9.42108C2.5 7.04419 5.04833 5.53744 7.131 6.6829L26.3653 17.2618C28.524 18.449 28.524 21.5509 26.3653 22.7381L7.13099 33.317C5.04833 34.4625 2.5 32.9557 2.5 30.5788V9.42108Z" fill="#EBFAFF"/>
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
              {movie.description || `Добавьте описание ${mediaType === 'dorama' ? 'дорамы' : 'фильма'} в базе данных, чтобы увидеть его здесь.`}
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

          <section className="v2comments-section">
            <h2 className="v2section-title-medium">Комментарии</h2>
            {currentUser ? (
              <form className="comment-form" onSubmit={handleSubmitComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Поделитесь впечатлениями о фильме"
                />
                <div className="comment-form-actions">
                  {commentSubmitError && <span className="comment-error">{commentSubmitError}</span>}
                  <button type="submit" disabled={isSendingComment || !commentText.trim()}>
                    {isSendingComment ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="comment-auth-hint">
                Войдите в профиль, чтобы оставлять комментарии.
              </div>
            )}

            {commentsLoading && <div className="comment-state">Загружаем комментарии...</div>}
            {!commentsLoading && commentsError && (
              <div className="comment-state comment-error">{commentsError}</div>
            )}
            {!commentsLoading && !commentsError && comments.length === 0 && (
              <div className="comment-state">Пока нет ни одного комментария. Будьте первым!</div>
            )}
            {!commentsLoading && comments.length > 0 && (
              <ul className="comments-list">
                {comments.map((comment) => (
                  <li className="comment-card" key={comment.id}>
                    <div className="comment-card-header">
                      <strong>{comment.userName}</strong>
                      <span>{formatCommentDate(comment.createdAt)}</span>
                    </div>
                    <p>{comment.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}

export default MovieShow;
