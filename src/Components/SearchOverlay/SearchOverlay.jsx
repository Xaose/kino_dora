import { useEffect, useMemo, useRef, useState } from 'react';
import './SearchOverlay.scss';
import { moviesService, doramasService } from '../../Backend/database';

const MAX_RESULTS = 8;

function SearchOverlay({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setError('');
    setLoading(true);

    Promise.allSettled([moviesService.getAll(), doramasService.getAll()])
      .then((results) => {
        const [moviesResult, doramasResult] = results;
        const movies =
          moviesResult.status === 'fulfilled' && Array.isArray(moviesResult.value)
            ? moviesResult.value.map((item) => ({ ...item, mediaType: 'movie' }))
            : [];
        const doramas =
          doramasResult.status === 'fulfilled' && Array.isArray(doramasResult.value)
            ? doramasResult.value.map((item) => ({ ...item, mediaType: 'dorama' }))
            : [];

        if (movies.length === 0 && doramas.length === 0) {
          setError('Не удалось загрузить каталог. Попробуйте позже.');
        } else {
          setError('');
        }

        setCatalog([...movies, ...doramas]);
      })
      .catch((err) => {
        console.error('Ошибка загрузки каталога для поиска:', err);
        setError('Не удалось загрузить каталог. Попробуйте позже.');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Небольшая задержка, чтобы input успел появиться
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return catalog.slice(0, MAX_RESULTS);
    }

    return catalog
      .filter((item) => {
        const title = (item.title || '').toLowerCase();
        const original = (item.originalTitle || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const actors = Array.isArray(item.actors) ? item.actors.join(' ').toLowerCase() : '';
        return (
          title.includes(normalizedQuery) ||
          original.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          actors.includes(normalizedQuery)
        );
      })
      .slice(0, MAX_RESULTS);
  }, [catalog, query]);

  const handleSelectItem = (item) => {
    if (!item || typeof item.id === 'undefined') return;
    onClose?.();
    if (onNavigate) {
      onNavigate('movieshow', null, { movieId: item.id, type: item.mediaType === 'dorama' ? 'dorama' : 'movie' });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="search-overlay" role="dialog" aria-modal="true">
      <div className="search-overlay-backdrop" onClick={onClose} />
      <div className="search-overlay-panel">
        <div className="search-overlay-header">
          <div className="search-input-container">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.3332 18.3334L13.4998 13.5M15.8332 9.16671C15.8332 5.94504 13.2215 3.33337 9.99984 3.33337C6.77817 3.33337 4.1665 5.94504 4.1665 9.16671C4.1665 12.3884 6.77817 15 9.99984 15C13.2215 15 15.8332 12.3884 15.8332 9.16671Z"
                stroke="#8FA2C7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск фильмов и дорам по названию, описанию или актёрам"
              aria-label="Поиск фильмов и дорам"
            />
          </div>
          <button className="search-overlay-close" onClick={onClose} type="button">
            Закрыть
          </button>
        </div>

        <div className="search-overlay-content">
          {loading && <div className="search-state">Загружаем каталог...</div>}
          {error && !loading && <div className="search-state error">{error}</div>}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="search-state">Ничего не найдено. Попробуйте другой запрос.</div>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <ul className="search-results">
              {filteredItems.map((item) => (
                <li key={`${item.mediaType}-${item.id}`}>
                  <button type="button" className="search-result-card" onClick={() => handleSelectItem(item)}>
                    <div className="poster">
                      {item.posterUrl ? (
                        <img src={item.posterUrl} alt={item.title} loading="lazy" />
                      ) : (
                        <div className="poster-placeholder">Нет постера</div>
                      )}
                    </div>
                    <div className="result-info">
                      <p className="title">{item.title}</p>
                      <p className="meta">
                        <span className={`type-badge type-${item.mediaType}`}>
                          {item.mediaType === 'dorama' ? 'Дорама' : 'Фильм'}
                        </span>
                        <span>
                          {item.releaseYear || 'Год неизвестен'}
                          {item.genres && item.genres.length > 0 && ` • ${item.genres.slice(0, 2).join(', ')}`}
                        </span>
                      </p>
                      {item.description && <p className="description">{item.description}</p>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;

