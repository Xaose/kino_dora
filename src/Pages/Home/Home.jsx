import { useState, useEffect, useMemo, useRef } from 'react';
import './Home.scss';
import FAQ from '../../Components/FAQ/FAQ';
import Studios from '../../Components/Studios/Studios';
import Footer from '../../Components/Footer/Footer';
import Movie from '../../Components/Movie/Movie';
import Series from '../../Components/Series/Series';
import { useMovies } from '../../hooks/useMovies';
import { useDoramas } from '../../hooks/useDoramas';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import { getCurrentUser, onAuthStateChange } from '../../Backend/authService';
import { addToFavorites } from '../../Backend/favoritesService';
import { watchHistoryService } from '../../Backend/database';
import { moviesService, doramasService } from '../../Backend/database';
import { showSuccess, showError } from '../../Components/Toast/Toast';

// Маппинг русских названий жанров на английские
const genreMapping = {
  'Драма': ['Драма', 'Drama', 'драма'],
  'Боевик': ['Боевик', 'Action', 'Экшн', 'боевик', 'action', 'экшн'],
  'Исследования': ['Исследования', 'Research', 'исследования'],
  'Роман': ['Роман', 'Romance', 'Романтика', 'роман', 'romance', 'романтика'],
  'Фантастика': ['Фантастика', 'Fantasy', 'Sci-Fi', 'Science Fiction', 'фантастика', 'fantasy'],
  'Комедия': ['Комедия', 'Comedy', 'комедия', 'comedy'],
  'Анимация': ['Анимация', 'Animation', 'анимация', 'animation'],
  'Триллер': ['Триллер', 'Thriller', 'триллер', 'thriller'],
  'Мистическое': ['Мистическое', 'Mystery', 'Мистика', 'мистическое', 'mystery', 'мистика'],
  'Историческое': ['Историческое', 'History', 'Исторический', 'историческое', 'history', 'исторический']
};

const homePlans = [
  {
    id: 'basic',
    name: 'База',
    duration: '3 месяца',
    price: '$15.14',
    monthly: '≈ $5.05/мес',
    description: 'Для знакомства с платформой и просмотра в HD',
    features: ['Полная библиотека в HD', '1 устройство одновременно', 'Загрузка до 5 тайтлов'],
    accent: 'blue'
  },
  {
    id: 'standard',
    name: 'Подписка',
    duration: '6 месяцев',
    price: '$22.99',
    previousPrice: '$24.99',
    monthly: '≈ $3.83/мес',
    description: 'Лучшее соотношение контента и цены',
    features: ['Кино + дорамы + эксклюзивы', '2 устройства', 'Расширенные коллекции'],
    badge: 'Топ выбор',
    accent: 'purple'
  },
  {
    id: 'premium',
    name: 'Премка',
    duration: '12 месяцев',
    price: '$35.19',
    monthly: '≈ $2.93/мес',
    description: 'Для ежедневного просмотра в 4K + HDR',
    features: ['4 устройства', 'Dolby Vision/Atmos', 'Семейные профили'],
    accent: 'pink'
  }
];

function Home({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedMovieGenres, setSelectedMovieGenres] = useState(['Драма', 'Боевик', 'Фантастика', 'Триллер']);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState(['Драма', 'Роман', 'Боевик']);
  const [witcherMovieId, setWitcherMovieId] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const movieGenresRef = useRef(null);
  const doramaGenresRef = useRef(null);
  
  // Загрузка данных из Firebase
  const { movies, loading: moviesLoading } = useMovies();
  const { doramas, loading: doramasLoading } = useDoramas();

  const genres = ['Драма', 'Боевик', 'Исследования', 'Роман', 'Фантастика', 'Комедия', 'Анимация', 'Триллер', 'Мистическое', 'Историческое'];

  // Создаем список популярного, чередуя фильмы и дорамы через одну
  const trendingItems = useMemo(() => {
    const items = [];
    let movieIndex = 0;
    let doramaIndex = 0;
    const maxItems = 20;
    
    // Чередуем: фильм, дорама, фильм, дорама...
    while (items.length < maxItems && (movieIndex < movies.length || doramaIndex < doramas.length)) {
      // Добавляем фильм (если есть)
      if (movieIndex < movies.length && items.length < maxItems) {
        items.push({ ...movies[movieIndex], type: 'movie' });
        movieIndex++;
      }
      // Добавляем дораму (если есть)
      if (doramaIndex < doramas.length && items.length < maxItems) {
        items.push({ ...doramas[doramaIndex], type: 'dorama' });
        doramaIndex++;
      }
    }
    
    return items;
  }, [movies, doramas]);

  // Фильтруем фильмы по выбранным жанрам
  const filteredMovies = useMemo(() => {
    if (selectedMovieGenres.length === 0) return movies;
    return movies.filter(movie => {
      if (!movie.genres || movie.genres.length === 0) return false;
      return selectedMovieGenres.some((selectedGenre) => {
        const genreVariants = genreMapping[selectedGenre] || [selectedGenre];
        return movie.genres.some((movieGenre) => {
          const movieGenreLower = (movieGenre || '').toLowerCase();
          return genreVariants.some(variant => 
            variant.toLowerCase() === movieGenreLower
          );
        });
      });
    });
  }, [movies, selectedMovieGenres]);

  // Фильтруем дорамы по выбранным жанрам
  const filteredDoramas = useMemo(() => {
    if (selectedSeriesGenres.length === 0) return doramas;
    return doramas.filter(dorama => {
      if (!dorama.genres || dorama.genres.length === 0) return false;
      return selectedSeriesGenres.some((selectedGenre) => {
        const genreVariants = genreMapping[selectedGenre] || [selectedGenre];
        return dorama.genres.some((doramaGenre) => {
          const doramaGenreLower = (doramaGenre || '').toLowerCase();
          return genreVariants.some(variant => 
            variant.toLowerCase() === doramaGenreLower
          );
        });
      });
    });
  }, [doramas, selectedSeriesGenres]);

  // ID фильма "Ведьмак" в базе данных
  const WITCHER_MOVIE_ID = 'F00cUFhuNfhPMSdNW8E0';

  // Подписка на изменения аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Загрузка истории просмотра
  useEffect(() => {
    const loadWatchHistory = async () => {
      if (!currentUser) {
        setContinueWatching([]);
        return;
      }

      try {
        const history = await watchHistoryService.getByUser(currentUser.uid);
        
        // Фильтруем только те, которые не просмотрены полностью (progress < 95%)
        const inProgress = history.filter(item => item.progress < 95);
        
        // Загружаем данные фильмов/дорам
        if (inProgress.length > 0) {
          const itemsWithData = await Promise.all(
            inProgress.map(async (item) => {
              try {
                const service = item.mediaType === 'dorama' ? doramasService : moviesService;
                const mediaData = await service.getById(item.movieId);
                return { ...item, mediaData };
              } catch (err) {
                console.error(`Ошибка загрузки ${item.mediaType}:`, err);
                return null;
              }
            })
          );
          setContinueWatching(itemsWithData.filter(Boolean));
        } else {
          setContinueWatching([]);
        }
      } catch (err) {
        console.error('Ошибка загрузки истории просмотра:', err);
        setContinueWatching([]);
      }
    };

    loadWatchHistory();
  }, [currentUser, movies.length, doramas.length]);

  // Проверяем наличие фильма "Ведьмак" при загрузке данных
  useEffect(() => {
    if (movies.length > 0) {
      const witcher = movies.find(movie => movie.id === WITCHER_MOVIE_ID);
      if (witcher) {
        setWitcherMovieId(WITCHER_MOVIE_ID);
      } else {
        // Если фильм не найден в загруженных, все равно устанавливаем ID
        // (фильм может быть в базе, но еще не загружен)
        setWitcherMovieId(WITCHER_MOVIE_ID);
      }
    } else {
      // Устанавливаем ID сразу, даже если фильмы еще не загружены
      setWitcherMovieId(WITCHER_MOVIE_ID);
    }
  }, [movies]);

  // Обработчики для открытия фильма/дорамы
  const openMovie = (movieId) => {
    onNavigate?.('movieshow', null, { movieId });
  };

  const openDorama = (doramaId) => {
    onNavigate?.('movieshow', null, { movieId: doramaId, type: 'dorama' });
  };

  // Обработчик кнопки "Смотреть"
  const handleWatchClick = () => {
    if (witcherMovieId) {
      onNavigate?.('playing', null, { movieId: witcherMovieId, type: 'movie' });
    }
  };

  // Обработчик кнопки "Инфо"
  const handleInfoClick = () => {
    if (witcherMovieId) {
      onNavigate?.('movieshow', null, { movieId: witcherMovieId, type: 'movie' });
    }
  };

  // Обработчики для добавления в избранное
  const handleAddMovieToFavorites = async (movieId) => {
    const user = getCurrentUser();
    if (!user) {
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    try {
      const result = await addToFavorites(user.uid, movieId);
      if (result.success) {
        showSuccess('Фильм добавлен в избранное');
      } else {
        showError(result.error || 'Ошибка добавления в избранное');
      }
    } catch (error) {
      showError('Ошибка добавления в избранное');
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const handleAddDoramaToFavorites = async (doramaId) => {
    const user = getCurrentUser();
    if (!user) {
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    try {
      const result = await addToFavorites(user.uid, doramaId);
      if (result.success) {
        showSuccess('Дорама добавлена в избранное');
      } else {
        showError(result.error || 'Ошибка добавления в избранное');
      }
    } catch (error) {
      showError('Ошибка добавления в избранное');
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const handleContinueWatching = (item) => {
    if (onNavigate && item.mediaData) {
      onNavigate('playing', null, {
        movieId: item.movieId,
        type: item.mediaType,
        seasonNumber: item.seasonNumber,
        episodeNumber: item.episodeNumber
      });
    }
  };

  const films = [
    {
      id: 1,
      image: 'https://www.digitaltrends.com/wp-content/uploads/2023/06/The-Witcher-Season-3-trailer-2.jpg?resize=1200%2C630&p=1',
      alt: 'The Witcher Scene 1'
    },
    {
      id: 2,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/c03269ff6c3c34e6856e73832461d54d6dc06eaf?width=400',
      alt: 'The Witcher Scene 2'
    },
    {
      id: 3,
      image: 'https://i.playground.ru/e/Ajxd_ItGQJlfYHJSfbg19A.png',
      alt: 'The Witcher Scene 3'
    },
    {
      id: 4,
      image: 'https://www.tvinsider.com/wp-content/uploads/2023/04/freya-allen-the-witcher.jpg',
      alt: 'The Witcher Scene 4'
    }
  ];

  useEffect(() => {
    if (films.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % films.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [films.length]);

  const getItemClass = (index) => {
    const diff = (index - activeIndex + films.length) % films.length;
    if (diff === 0) return 'poster-item poster-active';
    if (diff === 1) return 'poster-item poster-next';
    if (diff === films.length - 1) return 'poster-item poster-prev';
    return 'poster-item poster-hidden';
  };

  const toggleGenre = (genre, type) => {
    if (type === 'movies') {
      setSelectedMovieGenres(prev =>
        prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
      );
    } else {
      setSelectedSeriesGenres(prev =>
        prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
      );
    }
  };

  const scrollGenres = (type, direction) => {
    const ref = type === 'movies' ? movieGenresRef : doramaGenresRef;
    if (!ref.current) return;
    const amount = 220;
    ref.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-banner">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/ecf0bdfbd4cbd4fec40e3fb68b93712eb496e96a?width=2340" 
            alt="The Witcher Banner" 
            className="banner-image"
          />
          
          <div className="gradient-overlay">
            <div className="gradient-main"></div>
            <div className="gradient-bottom"></div>
          </div>

          <div className="witcher-logo">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/abe5e085c78c4ca4cc0ee0c62ef87aa74f0b2bde?width=1301" 
              alt="The Witcher Logo" 
            />
          </div>

          <div className="film-posters">
            {films.map((film, index) => (
              <div 
                key={film.id} 
                className={getItemClass(index)}
                onClick={() => setActiveIndex(index)}
              >
                <img src={film.image} alt={film.alt} />
                <div className="poster-overlay"></div>
              </div>
            ))}
          </div>

          <div className="hero-content">
            <h1 className="hero-title">Ведьмак</h1>
            
            <p className="hero-description">
              Геральт из Ривии, наемный охотник на монстров-мутантов, отправляется навстречу своей судьбе в неспокойном мире, где люди часто оказываются более злыми, чем звери
            </p>

            <div className="hero-ratings">
              <div className="star-rating">
                {[...Array(4)].map((_, i) => (
                  <svg 
                    key={i} 
                    className="star-full"
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M8.99044 1.67567C9.36406 0.777381 10.6366 0.777381 11.0102 1.67567L12.7452 5.8471L17.2486 6.20813C18.2184 6.28588 18.6116 7.49612 17.8727 8.12904L14.4416 11.0682L15.4899 15.4627C15.7156 16.4091 14.6861 17.157 13.8559 16.6499L10.0003 14.295L6.14477 16.6499C5.31451 17.157 4.28501 16.4091 4.51075 15.4627L5.55901 11.0682L2.12789 8.12904C1.38903 7.49612 1.78225 6.28588 2.75203 6.20813L7.25544 5.8471L8.99044 1.67567Z" 
                      fill="#E5DB22" 
                      fillOpacity="0.84"
                    />
                  </svg>
                ))}
                <div className="star-half-container">
                  <svg 
                    className="star-base"
                    width="20" 
                    height="20" 
                    viewBox="0 0 20 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M8.99044 1.67567C9.36406 0.777381 10.6366 0.777381 11.0102 1.67567L12.7452 5.8471L17.2486 6.20813C18.2184 6.28588 18.6116 7.49612 17.8727 8.12904L14.4416 11.0682L15.4899 15.4627C15.7156 16.4091 14.6861 17.157 13.8559 16.6499L10.0003 14.295L6.14477 16.6499C5.31451 17.157 4.28501 16.4091 4.51075 15.4627L5.55901 11.0682L2.12789 8.12904C1.38903 7.49612 1.78225 6.28588 2.75203 6.20813L7.25544 5.8471L8.99044 1.67567Z" 
                      fill="#E5DB22" 
                      fillOpacity="0.84"
                    />
                  </svg>
                  <div className="star-cover"></div>
                </div>
              </div>

              <div className="imdb-rating">
                <div className="imdb-logo">
                  <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d69d2bbf7f586eba84131e5f2365bf6500447882?width=184" 
                    alt="IMDb"
                  />
                </div>
                <span className="rating-value">8.1</span>
              </div>

              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/59eacd9dda1638bce3a56ed93e1c399121863782?width=107" 
                alt="Netflix" 
                className="netflix-logo"
              />
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-watch" onClick={handleWatchClick} disabled={!witcherMovieId}>
              <svg 
                className="play-icon"
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M1 3.76838C1 2.81763 2.01933 2.21493 2.8524 2.67311L10.5461 6.90466C11.4096 7.37957 11.4096 8.62029 10.5461 9.0952L2.8524 13.3267C2.01933 13.7849 1 13.1822 1 12.2315V3.76838Z" 
                  fill="#EBFAFF"
                />
              </svg>
              Смотреть
            </button>

            <button className="btn-info" onClick={handleInfoClick} disabled={!witcherMovieId}>
              Инфо
              <svg 
                className="arrow-icon"
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M9 13L14 8M14 8L9 3M14 8L2 8" 
                  stroke="#EBFAFF" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {continueWatching.length > 0 && (
        <section className="continue-watching-section">
          <div className="section-header">
            <h2 className="section-title">Продолжить просмотр</h2>
          </div>
          <div className="movies-scroll">
            <div className="movies-list">
              {continueWatching.slice(0, 10).map((item) => {
                if (!item.mediaData) return null;
                
                const progress = item.progress || 0;
                const isSeries = item.mediaType === 'dorama';
                
                return isSeries ? (
                  <div key={`continue-${item.id}`} className="continue-watching-item">
                    <Series
                      image={item.mediaData.posterUrl || POSTER_PLACEHOLDER}
                      alt={item.mediaData.title}
                      title={item.mediaData.title}
                      subtitle={item.seasonNumber && item.episodeNumber 
                        ? `Сезон ${item.seasonNumber}, Серия ${item.episodeNumber}` 
                        : [item.mediaData.releaseYear, item.mediaData.genres?.[0]].filter(Boolean).join(' • ')}
                      onClick={() => handleContinueWatching(item)}
                      onAddToFavorites={handleAddDoramaToFavorites}
                      doramaId={item.movieId}
                    />
                    <div className="continue-progress-bar">
                      <div 
                        className="continue-progress-filled" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div key={`continue-${item.id}`} className="continue-watching-item">
                    <Movie
                      image={item.mediaData.posterUrl || POSTER_PLACEHOLDER}
                      alt={item.mediaData.title}
                      title={item.mediaData.title}
                      subtitle={[item.mediaData.releaseYear, item.mediaData.genres?.[0]].filter(Boolean).join(' • ')}
                      onClick={() => handleContinueWatching(item)}
                      onAddToFavorites={handleAddMovieToFavorites}
                      movieId={item.movieId}
                    />
                    <div className="continue-progress-bar">
                      <div 
                        className="continue-progress-filled" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Популярное</h2>
          <button className="see-more-btn" onClick={() => onNavigate?.('movies')}>
            Больше
            <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7407 19.8516L21.377 12.2231M21.377 12.2231L13.7485 4.58683M21.377 12.2231L3.05927 12.2138" stroke="#228EE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="movies-scroll">
          <div className="movies-list">
            {moviesLoading || doramasLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`trending-skeleton-${index}`} className="movie-card">
                  <img src={POSTER_PLACEHOLDER} alt="Загрузка..." />
                </div>
              ))
            ) : trendingItems.length > 0 ? (
              trendingItems.map(item => {
                if (item.type === 'movie') {
                  return (
                    <Movie
                      key={`movie-${item.id}`}
                      image={item.posterUrl || POSTER_PLACEHOLDER}
                      alt={item.title}
                      title={item.title}
                      subtitle={[item.releaseYear, item.genres?.[0]].filter(Boolean).join(' • ')}
                      onClick={() => openMovie(item.id)}
                      onAddToFavorites={handleAddMovieToFavorites}
                      movieId={item.id}
                    />
                  );
                } else {
                  return (
                    <Series
                      key={`dorama-${item.id}`}
                      image={item.posterUrl || POSTER_PLACEHOLDER}
                      alt={item.title}
                      title={item.title}
                      subtitle={[item.releaseYear, item.genres?.[0]].filter(Boolean).join(' • ')}
                      onClick={() => openDorama(item.id)}
                      onAddToFavorites={handleAddDoramaToFavorites}
                      doramaId={item.id}
                    />
                  );
                }
              })
            ) : (
              <div className="movies-status">Нет доступного контента</div>
            )}
          </div>
        </div>
      </section>

      <section className="movies-section">
        <div className="section-backdrop"></div>
        <div className="section-header">
          <h2 className="section-title">Фильмы</h2>
          <button className="see-more-btn">
            Больше
            <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7407 19.8516L21.377 12.2231M21.377 12.2231L13.7485 4.58683M21.377 12.2231L3.05927 12.2138" stroke="#228EE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="genres-section">
          <button className="scroll-btn scroll-left" onClick={() => scrollGenres('movies', 'left')}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.2288 11.9476C11.9237 12.2527 11.9237 12.7473 12.2288 13.0524L20.0413 20.8649C20.3464 21.17 20.8411 21.17 21.1462 20.8649C21.4513 20.5598 21.4513 20.0652 21.1462 19.7601L13.8861 12.5L21.1462 5.23993C21.4513 4.93483 21.4513 4.44017 21.1462 4.13507C20.8411 3.82998 20.3464 3.82998 20.0413 4.13507L12.2288 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
          <div className="genres-list" ref={movieGenresRef}>
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-chip ${selectedMovieGenres.includes(genre) ? 'active' : ''}`}
                onClick={() => toggleGenre(genre, 'movies')}
              >
                {genre}
              </button>
            ))}
          </div>
          <button className="scroll-btn scroll-right" onClick={() => scrollGenres('movies', 'right')}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.9587 11.9476C17.2638 12.2527 17.2638 12.7473 16.9587 13.0524L9.14618 20.8649C8.84108 21.17 8.34642 21.17 8.04132 20.8649C7.73623 20.5598 7.73623 20.0652 8.04132 19.7601L15.3014 12.5L8.04132 5.23993C7.73623 4.93483 7.73623 4.44017 8.04132 4.13507C8.34642 3.82998 8.84108 3.82998 9.14618 4.13507L16.9587 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
        </div>

        <div className="movies-scroll">
          <div className="movies-list">
            {moviesLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`movies-skeleton-${index}`} className="movie-card">
                  <img src={POSTER_PLACEHOLDER} alt="Загрузка..." />
                </div>
              ))
            ) : filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <Movie
                  key={movie.id}
                  image={movie.posterUrl || POSTER_PLACEHOLDER}
                  alt={movie.title}
                  title={movie.title}
                  subtitle={[movie.releaseYear, movie.genres?.[0]].filter(Boolean).join(' • ')}
                  onClick={() => openMovie(movie.id)}
                  onAddToFavorites={handleAddMovieToFavorites}
                  movieId={movie.id}
                />
              ))
            ) : (
              <div className="movies-status">Нет фильмов по выбранным критериям</div>
            )}
          </div>
        </div>
      </section>

      <section className="series-section">
        <div className="section-backdrop"></div>
        <div className="section-header">
          <h2 className="section-title">Дорамы</h2>
          <button className="see-more-btn" onClick={() => onNavigate?.('serials')}>
            Больше
            <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7407 19.8514L21.377 12.2229M21.377 12.2229L13.7485 4.5867M21.377 12.2229L3.05927 12.2137" stroke="#228EE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="genres-section">
          <button className="scroll-btn scroll-left" onClick={() => scrollGenres('series', 'left')}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.2288 11.9476C11.9237 12.2527 11.9237 12.7473 12.2288 13.0524L20.0413 20.8649C20.3464 21.17 20.8411 21.17 21.1462 20.8649C21.4513 20.5598 21.4513 20.0652 21.1462 19.7601L13.8861 12.5L21.1462 5.23993C21.4513 4.93483 21.4513 4.44017 21.1462 4.13507C20.8411 3.82998 20.3464 3.82998 20.0413 4.13507L12.2288 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
          <div className="genres-list" ref={doramaGenresRef}>
            {genres.map(genre => (
              <button
                key={genre}
                className={`genre-chip ${selectedSeriesGenres.includes(genre) ? 'active' : ''}`}
                onClick={() => toggleGenre(genre, 'series')}
              >
                {genre}
              </button>
            ))}
          </div>
          <button className="scroll-btn scroll-right" onClick={() => scrollGenres('series', 'right')}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.9587 11.9476C17.2638 12.2527 17.2638 12.7473 16.9587 13.0524L9.14618 20.8649C8.84108 21.17 8.34642 21.17 8.04132 20.8649C7.73623 20.5598 7.73623 20.0652 8.04132 19.7601L15.3014 12.5L8.04132 5.23993C7.73623 4.93483 7.73623 4.44017 8.04132 4.13507C8.34642 3.82998 8.84108 3.82998 9.14618 4.13507L16.9587 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
        </div>

        <div className="movies-scroll">
          <div className="movies-list">
            {doramasLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`doramas-skeleton-${index}`} className="movie-card">
                  <img src={POSTER_PLACEHOLDER} alt="Загрузка..." />
                </div>
              ))
            ) : filteredDoramas.length > 0 ? (
              filteredDoramas.map(dorama => (
                <Series
                  key={dorama.id}
                  image={dorama.posterUrl || POSTER_PLACEHOLDER}
                  alt={dorama.title}
                  title={dorama.title}
                  subtitle={[dorama.releaseYear, dorama.genres?.[0]].filter(Boolean).join(' • ')}
                  onClick={() => openDorama(dorama.id)}
                  onAddToFavorites={handleAddDoramaToFavorites}
                  doramaId={dorama.id}
                />
              ))
            ) : (
              <div className="movies-status">Нет дорам по выбранным критериям</div>
            )}
          </div>
        </div>
      </section>

      <section className="home-pricing-preview">
        <div className="home-pricing-heading">
          <div>
            <p className="eyebrow-label">Подписки</p>
            <h2>Гибкие планы для любого темпа просмотра</h2>
            <p className="heading-description">
              Бесплатный пробный период 7 дней, отмена в один клик и прозрачная история платежей в профиле.
            </p>
          </div>

          <button className="view-plans-btn" type="button" onClick={() => onNavigate?.('pricing')}>
            Все тарифы
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 15L13 10L8 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="home-pricing-grid">
          {homePlans.map((plan) => (
            <article key={plan.id} className={`home-plan-card ${plan.accent}`}>
              <div className="home-plan-meta">
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                <span className="plan-duration">{plan.duration}</span>
              </div>

              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>

              <div className="plan-price">
                <div>
                  {plan.previousPrice && <span className="plan-old">{plan.previousPrice}</span>}
                  <p className="plan-new">{plan.price}</p>
                </div>
                <span className="plan-monthly">{plan.monthly}</span>
              </div>

              <ul className="plan-feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
                <li>Отмена без звонков</li>
              </ul>

              <button className="plan-cta" type="button" onClick={() => onNavigate?.('pricing')}>
                Оформить
              </button>
            </article>
          ))}
        </div>
      </section>

      <FAQ />
      <Studios />
      <Footer />
    </div>
  );
}

export default Home;
