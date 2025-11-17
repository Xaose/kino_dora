import { useMemo, useState } from 'react';
import './Movies.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Movie from '../../Components/Movie/Movie';
import { useMovies } from '../../hooks/useMovies';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import { getCurrentUser } from '../../Backend/authService';
import { addToFavorites } from '../../Backend/favoritesService';

// РњР°РїРїРёРЅРі СЂСѓСЃСЃРєРёС… РЅР°Р·РІР°РЅРёР№ Р¶Р°РЅСЂРѕРІ РЅР° Р°РЅРіР»РёР№СЃРєРёРµ
const genreMapping = {
  'Р”СЂР°РјР°': ['Р”СЂР°РјР°', 'Drama', 'РґСЂР°РјР°'],
  'Р‘РѕРµРІРёРє': ['Р‘РѕРµРІРёРє', 'Action', 'Р­РєС€РЅ', 'Р±РѕРµРІРёРє', 'action', 'СЌРєС€РЅ'],
  'РСЃР»РµРґРѕРІР°РЅРёСЏ': ['РСЃР»РµРґРѕРІР°РЅРёСЏ', 'Research', 'РёСЃСЃР»РµРґРѕРІР°РЅРёСЏ'],
  'Р РѕРјР°РЅ': ['Р РѕРјР°РЅ', 'Romance', 'Р РѕРјР°РЅС‚РёРєР°', 'СЂРѕРјР°РЅ', 'romance', 'СЂРѕРјР°РЅС‚РёРєР°'],
  'Р¤Р°РЅС‚Р°СЃС‚РёРєР°': ['Р¤Р°РЅС‚Р°СЃС‚РёРєР°', 'Fantasy', 'Sci-Fi', 'Science Fiction', 'С„Р°РЅС‚Р°СЃС‚РёРєР°', 'fantasy'],
  'РљРѕРјРµРґРёСЏ': ['РљРѕРјРµРґРёСЏ', 'Comedy', 'РєРѕРјРµРґРёСЏ', 'comedy'],
  'РђРЅРёРјР°С†РёСЏ': ['РђРЅРёРјР°С†РёСЏ', 'Animation', 'Р°РЅРёРјР°С†РёСЏ', 'animation'],
  'РўСЂРёР»Р»РµСЂ': ['РўСЂРёР»Р»РµСЂ', 'Thriller', 'С‚СЂРёР»Р»РµСЂ', 'thriller'],
  'РњРёСЃС‚РёС‡РµСЃРєРѕРµ': ['РњРёСЃС‚РёС‡РµСЃРєРѕРµ', 'Mystery', 'РњРёСЃС‚РёРєР°', 'РјРёСЃС‚РёС‡РµСЃРєРѕРµ', 'mystery', 'РјРёСЃС‚РёРєР°'],
  'РСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ': ['РСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ', 'History', 'РСЃС‚РѕСЂРёС‡РµСЃРєРёР№', 'РёСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ', 'history', 'РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№']
};

function Movies({ onNavigate }) {
  const [selectedGenres, setSelectedGenres] = useState(['Р”СЂР°РјР°', 'Р‘РѕРµРІРёРє', 'Р¤Р°РЅС‚Р°СЃС‚РёРєР°', 'РўСЂРёР»Р»РµСЂ']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');
  const { movies, loading: moviesLoading, error: moviesError } = useMovies();

  const genres = [
    'Р”СЂР°РјР°', 'Р‘РѕРµРІРёРє', 'РСЃР»РµРґРѕРІР°РЅРёСЏ', 'Р РѕРјР°РЅ', 
    'Р¤Р°РЅС‚Р°СЃС‚РёРєР°', 'РљРѕРјРµРґРёСЏ', 'РђРЅРёРјР°С†РёСЏ', 'РўСЂРёР»Р»РµСЂ', 
    'РњРёСЃС‚РёС‡РµСЃРєРѕРµ', 'РСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ'
  ];

  // Р“РµРЅРµСЂРёСЂСѓРµРј СЃРїРёСЃРѕРє РіРѕРґРѕРІ (РѕС‚ С‚РµРєСѓС‰РµРіРѕ РґРѕ 1900)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const filteredMovies = useMemo(() => {
    let result = movies;

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ РїРѕРёСЃРєРѕРІРѕРјСѓ Р·Р°РїСЂРѕСЃСѓ (РЅР°Р·РІР°РЅРёРµ)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((movie) => {
        const title = (movie.title || '').toLowerCase();
        const description = (movie.description || '').toLowerCase();
        return title.includes(query) || description.includes(query);
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ Р¶Р°РЅСЂР°Рј
    if (selectedGenres.length > 0) {
      result = result.filter((movie) => {
        if (!movie.genres || movie.genres.length === 0) return false;
        return selectedGenres.some((selectedGenre) => {
          const genreVariants = genreMapping[selectedGenre] || [selectedGenre];
          return movie.genres.some((movieGenre) => {
            const movieGenreLower = (movieGenre || '').toLowerCase();
            return genreVariants.some(variant => 
              variant.toLowerCase() === movieGenreLower
            );
          });
        });
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ РіРѕРґСѓ
    if (selectedYear) {
      const year = parseInt(selectedYear);
      result = result.filter((movie) => {
        const movieYear = movie.releaseYear || movie.release_year;
        return movieYear === year;
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ СЂРµР¶РёСЃСЃРµСЂСѓ
    if (selectedDirector.trim()) {
      const directorQuery = selectedDirector.toLowerCase().trim();
      result = result.filter((movie) => {
        const director = (movie.director || '').toLowerCase();
        return director.includes(directorQuery);
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ Р°РєС‚РµСЂСѓ
    if (selectedActor.trim()) {
      const actorQuery = selectedActor.toLowerCase().trim();
      result = result.filter((movie) => {
        if (!movie.actors || movie.actors.length === 0) return false;
        return movie.actors.some((actor) => {
          const actorName = (actor || '').toLowerCase();
          return actorName.includes(actorQuery);
        });
      });
    }

    return result;
  }, [movies, selectedGenres, searchQuery, selectedYear, selectedDirector, selectedActor]);

  const openMovie = (movieId) => {
    onNavigate?.('movieshow', null, { movieId });
  };

  const handleAddToFavorites = async (movieId) => {
    const user = getCurrentUser();
    if (!user) {
      // Р•СЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ, РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµРј РЅР° СЃС‚СЂР°РЅРёС†Сѓ РІС…РѕРґР°
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    try {
      const result = await addToFavorites(user.uid, movieId);
      if (result.success) {
        // РњРѕР¶РЅРѕ РїРѕРєР°Р·Р°С‚СЊ СѓРІРµРґРѕРјР»РµРЅРёРµ РѕР± СѓСЃРїРµС…Рµ
        console.log('Р¤РёР»СЊРј РґРѕР±Р°РІР»РµРЅ РІ РёР·Р±СЂР°РЅРЅРѕРµ');
      } else {
        console.error('РћС€РёР±РєР° РґРѕР±Р°РІР»РµРЅРёСЏ РІ РёР·Р±СЂР°РЅРЅРѕРµ:', result.error);
      }
    } catch (error) {
      console.error('РћС€РёР±РєР° РґРѕР±Р°РІР»РµРЅРёСЏ РІ РёР·Р±СЂР°РЅРЅРѕРµ:', error);
    }
  };

  const renderMovies = () => {
    if (moviesError) {
      return <div className="movies-status error">РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РёР»СЊРјС‹. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.</div>;
    }

    if (moviesLoading) {
      return Array.from({ length: 12 }).map((_, index) => (
        <Movie key={`movies-skeleton-${index}`} image={POSTER_PLACEHOLDER} alt="Р—Р°РіСЂСѓР·РєР° С„РёР»СЊРјРѕРІ" />
      ));
    }

    if (!filteredMovies.length) {
      const hasFilters = searchQuery || selectedYear || selectedDirector || selectedActor || selectedGenres.length > 0;
      return (
        <div className="movies-status">
          {hasFilters 
            ? 'РџРѕ РІР°С€РµРјСѓ Р·Р°РїСЂРѕСЃСѓ РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РєСЂРёС‚РµСЂРёРё РїРѕРёСЃРєР°.' 
            : 'Р”РѕР±Р°РІСЊС‚Рµ С„РёР»СЊРјС‹ РІ РєРѕР»Р»РµРєС†РёСЋ Firestore, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РёС… Р·РґРµСЃСЊ.'}
        </div>
      );
    }

    return filteredMovies.map((movie) => (
      <Movie
        key={movie.id}
        image={movie.posterUrl || POSTER_PLACEHOLDER}
        alt={movie.title}
        title={movie.title}
        subtitle={[movie.releaseYear, movie.genres?.[0]].filter(Boolean).join(' вЂў ')}
        onClick={() => openMovie(movie.id)}
        onAddToFavorites={handleAddToFavorites}
        movieId={movie.id}
      />
    ));
  };

  return (
    <div className="movies-page">
      <div className="page-background"></div>
      <Header onNavigate={onNavigate} />
      
      <main className="movies-content">
        <div className="movies-container">
          <div className="search-section">
            <div className="search-title-badge">
              <svg className="title-decoration" width="290" height="110" viewBox="0 0 290 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4227 15.4163C32.8806 -6.61609 242.763 -3.60644 275.466 15.4163C301.926 30.8084 285.566 82.9256 278.357 102.259C276.689 106.734 272.377 109.556 267.602 109.556H18.8207C17.8919 109.556 16.9276 109.692 16.0093 109.831C-12.0157 114.079 2.21436 37.0931 17.4227 15.4163Z" fill="#228EE5"/>
              </svg>
              <h1 className="search-title">Р Р°СЃС€РёСЂРµРЅРЅС‹Р№ РїРѕРёСЃРє</h1>
            </div>

            <div className="search-card">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/993751c7b2520da7a11659ff51115957f4b5f5b0?width=452" 
                alt="Search Logo" 
                className="search-logo"
              />

              <div className="search-filters">
                <div className="filter-row">
                  <div className="filter-group">
                    <label className="filter-label">Р“РѕРґ</label>
                    <select 
                      className="filter-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--color-text-primary)', 
                        fontSize: '14px',
                        cursor: 'pointer',
                        appearance: 'none',
                        width: '100%',
                        padding: '8px 30px 8px 12px'
                      }}
                    >
                      <option value="">Р’СЃРµ РіРѕРґС‹</option>
                      {years.map(year => (
                        <option key={year} value={year} style={{ background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">РЎС‚СЂР°РЅР°</label>
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Р’РІРµРґРёС‚Рµ СЃС‚СЂР°РЅСѓ"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        width: '100%',
                        padding: '8px 12px'
                      }}
                    />
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">РђРєС‚С‘СЂ</label>
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Р’РІРµРґРёС‚Рµ РёРјСЏ Р°РєС‚С‘СЂР°"
                      value={selectedActor}
                      onChange={(e) => setSelectedActor(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        fontSize: '14px',
                        width: '100%',
                        padding: '8px 12px'
                      }}
                    />
                  </div>
                </div>

                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="РџРѕРёСЃРє РїРѕ РЅР°Р·РІР°РЅРёСЋ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="search-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.041 6.3623L8.75976 7.73926V2.10938L6.08887 11.4014L8.75976 10.2197V16.582L12.041 6.3623ZM7.97851 1.64062L7.91504 1.87012L7.17285 4.45312C5.20508 5.20996 3.80859 7.11914 3.80859 9.35059C3.80859 11.9043 5.4834 14.0332 7.88086 14.502V17.1191C4.07715 16.6064 1.26953 13.3008 1.26953 9.35547C1.26953 5.4248 4.18945 2.16797 7.97851 1.64062ZM23.1836 23.4766C22.6367 24.0234 22.0557 24.0771 21.7871 23.9893C21.5234 23.9014 20.4639 23.0176 18.8379 21.8213C17.2119 20.6201 17.1973 20.0781 16.7383 19.0527C16.2793 18.0322 15.2539 16.9727 13.9307 16.4941L13.457 15.7764C12.251 16.6016 10.8691 17.0898 9.4873 17.1777L9.58984 16.8555L10.3662 14.4385C12.6367 13.8574 14.3164 11.8018 14.3164 9.35059C14.3164 6.68945 12.4414 4.36523 9.62891 4.12109V1.57715C13.6914 1.82617 16.8945 5.21484 16.8945 9.35547C16.8945 10.9961 16.3477 12.5146 15.4785 13.7695L16.1914 14.2383C16.6699 15.5615 17.7295 16.582 18.75 17.041C19.7705 17.5 20.3223 17.5146 21.5234 19.1406C22.7246 20.7617 23.6084 21.8213 23.6963 22.085C23.7842 22.3486 23.7305 22.9297 23.1836 23.4766ZM22.7002 22.6025C22.7002 22.3877 22.5244 22.2119 22.3096 22.2119C22.0947 22.2119 21.9189 22.3877 21.9189 22.6025C21.9189 22.8174 22.0947 22.9932 22.3096 22.9932C22.5244 22.9932 22.7002 22.8174 22.7002 22.6025Z" fill="var(--color-text-primary)"/>
                  </svg>
                </div>

                <div className="filter-group director-filter">
                  <label className="filter-label">РљРёРЅРѕСЂРµР¶РёСЃС‘СЂ</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Р’РІРµРґРёС‚Рµ РёРјСЏ СЂРµР¶РёСЃСЃС‘СЂР°"
                    value={selectedDirector}
                    onChange={(e) => setSelectedDirector(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-primary)',
                      fontSize: '14px',
                      width: '100%',
                      padding: '8px 12px'
                    }}
                  />
                </div>
              </div>

              <div className="genre-tags">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`genre-tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="movies-grid-section">
            <h2 className="movies-title">Р¤РёР»СЊРјС‹</h2>
            
            <div className="movies-grid">
              {renderMovies()}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Movies;
