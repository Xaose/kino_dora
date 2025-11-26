import React, { useState, useEffect } from 'react';
import VideoPlayer from '../../Components/VideoPlayer/VideoPlayer';
import { useMedia } from '../../hooks/useMedia';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import { watchHistoryService } from '../../Backend/database';
import { getCurrentUser } from '../../Backend/authService';
import { showSuccess } from '../../Components/Toast/Toast';
import './Playing.css';

function Playing({ onNavigate, selectedMovieId, mediaType = 'movie' }) {
  const { movie, loading, error } = useMedia(selectedMovieId, mediaType);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showSeasonEpisodeSelector, setShowSeasonEpisodeSelector] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const [watchHistory, setWatchHistory] = useState(null);

  // Загружаем историю просмотра при загрузке фильма
  useEffect(() => {
    const loadWatchHistory = async () => {
      const user = getCurrentUser();
      if (!user || !movie?.id) return;

      try {
        const seasonNum = selectedSeason?.seasonNumber || null;
        const episodeNum = selectedEpisode?.episodeNumber || null;
        const history = await watchHistoryService.getByMovie(
          user.uid,
          movie.id,
          mediaType,
          seasonNum,
          episodeNum
        );

        if (history) {
          setWatchHistory(history);
          // Восстанавливаем позицию только если просмотрено менее 95%
          if (history.progress < 95 && history.currentTime > 10) {
            setInitialTime(history.currentTime);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки истории просмотра:', err);
      }
    };

    if (movie && selectedSeason && selectedEpisode) {
      loadWatchHistory();
    } else if (movie && !selectedSeason && !selectedEpisode) {
      loadWatchHistory();
    }
  }, [movie, selectedSeason, selectedEpisode, mediaType]);

  useEffect(() => {
    if (movie) {
      const hasSeasons = movie.seasons && movie.seasons.length > 0;
      const hasEpisodes = movie.episodes && movie.episodes.length > 0;
      
      if (hasSeasons || hasEpisodes) {
        setShowSeasonEpisodeSelector(true);
        
        // Автоматически выбираем первый сезон и первую серию
        if (hasSeasons && movie.seasons[0]) {
          setSelectedSeason(movie.seasons[0]);
          if (movie.seasons[0].episodes && movie.seasons[0].episodes.length > 0) {
            setSelectedEpisode(movie.seasons[0].episodes[0]);
          }
        } else if (hasEpisodes && movie.episodes[0]) {
          setSelectedEpisode(movie.episodes[0]);
        }
      }
    }
  }, [movie]);

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('movieshow', null, { movieId: selectedMovieId, type: mediaType });
    }
  };

  const handleSeasonChange = async (season) => {
    setSelectedSeason(season);
    setInitialTime(0);
    setWatchHistory(null);
    
    if (season.episodes && season.episodes.length > 0) {
      const firstEpisode = season.episodes[0];
      setSelectedEpisode(firstEpisode);
      
      // Загружаем историю для новой серии
      const user = getCurrentUser();
      if (user && movie?.id) {
        try {
          const history = await watchHistoryService.getByMovie(
            user.uid,
            movie.id,
            mediaType,
            season.seasonNumber,
            firstEpisode.episodeNumber
          );
          if (history && history.progress < 95 && history.currentTime > 10) {
            setInitialTime(history.currentTime);
            setWatchHistory(history);
          }
        } catch (err) {
          console.error('Ошибка загрузки истории:', err);
        }
      }
    } else {
      setSelectedEpisode(null);
    }
  };

  const handleEpisodeChange = async (episode) => {
    setSelectedEpisode(episode);
    setInitialTime(0);
    setWatchHistory(null);
    
    // Загружаем историю для новой серии
    const user = getCurrentUser();
    if (user && movie?.id && selectedSeason) {
      try {
        const history = await watchHistoryService.getByMovie(
          user.uid,
          movie.id,
          mediaType,
          selectedSeason.seasonNumber,
          episode.episodeNumber
        );
        if (history && history.progress < 95 && history.currentTime > 10) {
          setInitialTime(history.currentTime);
          setWatchHistory(history);
        }
      } catch (err) {
        console.error('Ошибка загрузки истории:', err);
      }
    }
  };

  // Сохранение прогресса просмотра
  const handleProgressSave = async (currentTime, duration) => {
    const user = getCurrentUser();
    if (!user) {
      console.log('⚠️ Пользователь не авторизован, прогресс не сохраняется');
      return;
    }
    
    if (!movie?.id) {
      console.log('⚠️ Фильм не загружен, прогресс не сохраняется');
      return;
    }

    if (currentTime === 0 || duration === 0) {
      console.log('⚠️ Некорректные данные для сохранения:', { currentTime, duration });
      return;
    }

    try {
      const progress = Math.round((currentTime / duration) * 100);
      console.log('✅ Сохранение прогресса:', {
        movieId: movie.id,
        title: movie.title,
        currentTime: Math.round(currentTime),
        duration: Math.round(duration),
        progress: progress + '%',
        season: selectedSeason?.seasonNumber || null,
        episode: selectedEpisode?.episodeNumber || null
      });
      
      await watchHistoryService.saveProgress(user.uid, movie.id, mediaType, {
        currentTime,
        duration,
        seasonNumber: selectedSeason?.seasonNumber || null,
        episodeNumber: selectedEpisode?.episodeNumber || null
      });
      
      console.log('✅ Прогресс успешно сохранен');
    } catch (err) {
      console.error('❌ Ошибка сохранения прогресса:', err);
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

  // Определяем источник видео
  let videoSource = movie.videoUrl || movie.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  let videoTitle = movie.title;

  if (showSeasonEpisodeSelector) {
    if (selectedEpisode && selectedEpisode.videoUrl) {
      videoSource = selectedEpisode.videoUrl;
      videoTitle = `${movie.title} - ${selectedEpisode.title || `Сезон ${selectedSeason?.seasonNumber}, Серия ${selectedEpisode.episodeNumber}`}`;
    } else if (selectedSeason && selectedSeason.episodes && selectedSeason.episodes.length > 0) {
      // Если серия не выбрана, но есть сезон, берем первую серию
      const firstEpisode = selectedSeason.episodes[0];
      if (firstEpisode.videoUrl) {
        videoSource = firstEpisode.videoUrl;
        videoTitle = `${movie.title} - ${firstEpisode.title || `Сезон ${selectedSeason.seasonNumber}, Серия ${firstEpisode.episodeNumber}`}`;
      }
    }
  }

  return (
    <div className="playing-page">
      {showSeasonEpisodeSelector && (
        <div className="season-episode-selector">
          {movie.seasons && movie.seasons.length > 0 && (
            <div className="selector-group">
              <label htmlFor="season-select">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Сезон
              </label>
              <select
                id="season-select"
                value={selectedSeason?.seasonNumber || ''}
                onChange={(e) => {
                  const season = movie.seasons.find(s => s.seasonNumber === parseInt(e.target.value));
                  handleSeasonChange(season);
                }}
              >
                {movie.seasons.map((season) => (
                  <option key={season.seasonNumber} value={season.seasonNumber}>
                    {season.title || `Сезон ${season.seasonNumber}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedSeason && selectedSeason.episodes && selectedSeason.episodes.length > 0 && (
            <div className="selector-group">
              <label htmlFor="episode-select">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 6H10M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Серия
              </label>
              <select
                id="episode-select"
                value={selectedEpisode?.episodeNumber || ''}
                onChange={(e) => {
                  const episode = selectedSeason.episodes.find(ep => ep.episodeNumber === parseInt(e.target.value));
                  handleEpisodeChange(episode);
                }}
              >
                {selectedSeason.episodes.map((episode) => (
                  <option key={episode.episodeNumber} value={episode.episodeNumber}>
                    {episode.episodeNumber}. {episode.title || `Серия ${episode.episodeNumber}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {movie.episodes && movie.episodes.length > 0 && !movie.seasons && (
            <div className="selector-group">
              <label htmlFor="episode-select">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 6H10M6 10H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Серия
              </label>
              <select
                id="episode-select"
                value={selectedEpisode?.episodeNumber || ''}
                onChange={(e) => {
                  const episode = movie.episodes.find(ep => ep.episodeNumber === parseInt(e.target.value));
                  handleEpisodeChange(episode);
                }}
              >
                {movie.episodes.map((episode) => (
                  <option key={episode.episodeNumber} value={episode.episodeNumber}>
                    {episode.episodeNumber}. {episode.title || `Серия ${episode.episodeNumber}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <VideoPlayer
        videoUrl={videoSource}
        title={videoTitle}
        poster={movie.posterUrl || POSTER_PLACEHOLDER}
        onBack={handleBack}
        initialTime={initialTime}
        onProgressSave={handleProgressSave}
      />
    </div>
  );
}

export default Playing;
