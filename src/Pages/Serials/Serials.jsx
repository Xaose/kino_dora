import { useState, useMemo } from 'react';
import './Serials.scss';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Series from '../../Components/Series/Series';
import { useDoramas } from '../../hooks/useDoramas';
import { POSTER_PLACEHOLDER } from '../../constants/placeholders';
import { getCurrentUser } from '../../Backend/authService';
import { addToFavorites } from '../../Backend/favoritesService';

// РњР°РїРїРёРЅРі СЂСѓСЃСЃРєРёС… РЅР°Р·РІР°РЅРёР№ Р¶Р°РЅСЂРѕРІ РЅР° Р°РЅРіР»РёР№СЃРєРёРµ
const genreMapping = {
  'Р”СЂР°РјР°': ['Р”СЂР°РјР°', 'Drama', 'РґСЂР°РјР°'],
  'Р‘РѕРµРІРёРє': ['Р‘РѕРµРІРёРє', 'Action', 'Р­РєС€РЅ', 'Р±РѕРµРІРёРє', 'action', 'СЌРєС€РЅ'],
  'РСЃСЃР»РµРґРѕРІР°РЅРёСЏ': ['РСЃСЃР»РµРґРѕРІР°РЅРёСЏ', 'Research', 'РёСЃСЃР»РµРґРѕРІР°РЅРёСЏ'],
  'Р РѕРјР°РЅ': ['Р РѕРјР°РЅ', 'Romance', 'Р РѕРјР°РЅС‚РёРєР°', 'СЂРѕРјР°РЅ', 'romance', 'СЂРѕРјР°РЅС‚РёРєР°'],
  'Р¤Р°РЅС‚Р°СЃС‚РёРєР°': ['Р¤Р°РЅС‚Р°СЃС‚РёРєР°', 'Fantasy', 'Sci-Fi', 'Science Fiction', 'С„Р°РЅС‚Р°СЃС‚РёРєР°', 'fantasy'],
  'РљРѕРјРµРґРёСЏ': ['РљРѕРјРµРґРёСЏ', 'Comedy', 'РєРѕРјРµРґРёСЏ', 'comedy'],
  'РђРЅРёРјР°С†РёСЏ': ['РђРЅРёРјР°С†РёСЏ', 'Animation', 'Р°РЅРёРјР°С†РёСЏ', 'animation'],
  'РўСЂРёР»Р»РµСЂ': ['РўСЂРёР»Р»РµСЂ', 'Thriller', 'С‚СЂРёР»Р»РµСЂ', 'thriller'],
  'РњРёСЃС‚РёС‡РµСЃРєРѕРµ': ['РњРёСЃС‚РёС‡РµСЃРєРѕРµ', 'Mystery', 'РњРёСЃС‚РёРєР°', 'РјРёСЃС‚РёС‡РµСЃРєРѕРµ', 'mystery', 'РјРёСЃС‚РёРєР°'],
  'РСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ': ['РСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ', 'History', 'РСЃС‚РѕСЂРёС‡РµСЃРєРёР№', 'РёСЃС‚РѕСЂРёС‡РµСЃРєРѕРµ', 'history', 'РёСЃС‚РѕСЂРёС‡РµСЃРєРёР№']
};

function Serials({ onNavigate }) {
  const [selectedGenres, setSelectedGenres] = useState(['Р”СЂР°РјР°', 'Р РѕРјР°РЅ', 'Р‘РѕРµРІРёРє']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedActor, setSelectedActor] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');
  const { doramas, loading: doramasLoading, error: doramasError } = useDoramas();

  const genres = [
    'Р”СЂР°РјР°', 'Р‘РѕРµРІРёРє', 'РСЃСЃР»РµРґРѕРІР°РЅРёСЏ', 'Р РѕРјР°РЅ', 
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

  const filteredDoramas = useMemo(() => {
    let result = doramas;

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ РїРѕРёСЃРєРѕРІРѕРјСѓ Р·Р°РїСЂРѕСЃСѓ (РЅР°Р·РІР°РЅРёРµ)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((dorama) => {
        const title = (dorama.title || '').toLowerCase();
        const description = (dorama.description || '').toLowerCase();
        return title.includes(query) || description.includes(query);
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ Р¶Р°РЅСЂР°Рј
    if (selectedGenres.length > 0) {
      result = result.filter((dorama) => {
        if (!dorama.genres || dorama.genres.length === 0) return false;
        return selectedGenres.some((selectedGenre) => {
          const genreVariants = genreMapping[selectedGenre] || [selectedGenre];
          return dorama.genres.some((doramaGenre) => {
            const doramaGenreLower = (doramaGenre || '').toLowerCase();
            return genreVariants.some(variant => 
              variant.toLowerCase() === doramaGenreLower
            );
          });
        });
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ РіРѕРґСѓ
    if (selectedYear) {
      const year = parseInt(selectedYear);
      result = result.filter((dorama) => {
        const doramaYear = dorama.releaseYear || dorama.release_year;
        return doramaYear === year;
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ СЂРµР¶РёСЃСЃРµСЂСѓ
    if (selectedDirector.trim()) {
      const directorQuery = selectedDirector.toLowerCase().trim();
      result = result.filter((dorama) => {
        const director = (dorama.director || '').toLowerCase();
        return director.includes(directorQuery);
      });
    }

    // Р¤РёР»СЊС‚СЂР°С†РёСЏ РїРѕ Р°РєС‚РµСЂСѓ
    if (selectedActor.trim()) {
      const actorQuery = selectedActor.toLowerCase().trim();
      result = result.filter((dorama) => {
        if (!dorama.actors || dorama.actors.length === 0) return false;
        return dorama.actors.some((actor) => {
          const actorName = (actor || '').toLowerCase();
          return actorName.includes(actorQuery);
        });
      });
    }

    return result;
  }, [doramas, selectedGenres, searchQuery, selectedYear, selectedDirector, selectedActor]);

  const openDorama = (doramaId) => {
    onNavigate?.('movieshow', null, { movieId: doramaId, type: 'dorama' });
  };

  const handleAddToFavorites = async (doramaId) => {
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
        console.log('Р”РѕСЂР°РјР° РґРѕР±Р°РІР»РµРЅР° РІ РёР·Р±СЂР°РЅРЅРѕРµ');
      } else {
        console.error('РћС€РёР±РєР° РґРѕР±Р°РІР»РµРЅРёСЏ РІ РёР·Р±СЂР°РЅРЅРѕРµ:', result.error);
      }
    } catch (error) {
      console.error('РћС€РёР±РєР° РґРѕР±Р°РІР»РµРЅРёСЏ РІ РёР·Р±СЂР°РЅРЅРѕРµ:', error);
    }
  };

  const renderDoramas = () => {
    if (doramasError) {
      return <div className="serials-status error">РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РґРѕСЂР°РјС‹. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.</div>;
    }

    if (doramasLoading) {
      return Array.from({ length: 12 }).map((_, index) => (
        <Series key={`doramas-skeleton-${index}`} image={POSTER_PLACEHOLDER} alt="Р—Р°РіСЂСѓР·РєР° РґРѕСЂР°Рј" />
      ));
    }

    if (!filteredDoramas.length) {
      const hasFilters = searchQuery || selectedYear || selectedDirector || selectedActor || selectedGenres.length > 0;
      return (
        <div className="serials-status">
          {hasFilters 
            ? 'РџРѕ РІР°С€РµРјСѓ Р·Р°РїСЂРѕСЃСѓ РЅРёС‡РµРіРѕ РЅРµ РЅР°Р№РґРµРЅРѕ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РёР·РјРµРЅРёС‚СЊ РєСЂРёС‚РµСЂРёРё РїРѕРёСЃРєР°.' 
            : 'Р”РѕР±Р°РІСЊС‚Рµ РґРѕСЂР°РјС‹ РІ РєРѕР»Р»РµРєС†РёСЋ Firestore, С‡С‚РѕР±С‹ СѓРІРёРґРµС‚СЊ РёС… Р·РґРµСЃСЊ.'}
        </div>
      );
    }

    return filteredDoramas.map((dorama) => (
      <Series
        key={dorama.id}
        image={dorama.posterUrl || POSTER_PLACEHOLDER}
        alt={dorama.title}
        title={dorama.title}
        subtitle={[dorama.releaseYear, dorama.genres?.[0]].filter(Boolean).join(' вЂў ')}
        onClick={() => openDorama(dorama.id)}
        onAddToFavorites={handleAddToFavorites}
        doramaId={dorama.id}
      />
    ));
  };

  return (
    <div className="serials-page">
      <div className="serials-background"></div>
      <Header onNavigate={onNavigate} />
      
      <main className="serials-content">
        <div className="serials-container">
          <div className="serials-search-section">
            <div className="serials-title-badge">
              <svg className="serials-decoration" width="290" height="110" viewBox="0 0 290 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.3627 15.4163C32.7672 -6.61609 241.926 -3.60644 274.516 15.4163C300.879 30.8049 284.589 82.9023 277.402 102.246C275.737 106.728 271.422 109.556 266.641 109.556H18.7653C17.8334 109.556 16.8662 109.693 15.9448 109.832C-11.9711 114.061 2.20841 37.0907 17.3627 15.4163Z" fill="#228EE5"/>
              </svg>
              <h1 className="serials-title">Р Р°СЃС€РёСЂРµРЅРЅС‹Р№ РїРѕРёСЃРє</h1>
            </div>

            <div className="serials-card">
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/31b064e95860d282c64802f06a73d141c9330c19?width=452" 
                alt="Search Logo" 
                className="serials-logo"
              />

              <div className="serials-filters">
                <div className="serials-filter-row">
                  <div className="serials-filter-group">
                    <label className="serials-filter-label">Р“РѕРґ</label>
                    <select 
                      className="serials-filter-select"
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

                  <div className="serials-filter-group">
                    <label className="serials-filter-label">РЎС‚СЂР°РЅР°</label>
                    <input
                      type="text"
                      className="serials-filter-input"
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

                  <div className="serials-filter-group">
                    <label className="serials-filter-label">РђРєС‚С‘СЂ</label>
                    <input
                      type="text"
                      className="serials-filter-input"
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

                <div className="serials-search-input-wrapper">
                  <input 
                    type="text" 
                    className="serials-search-input" 
                    placeholder="РџРѕРёСЃРє РїРѕ РЅР°Р·РІР°РЅРёСЋ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="serials-search-icon" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.041 6.3623L8.75976 7.73926V2.10938L6.08887 11.4014L8.75976 10.2197V16.582L12.041 6.3623ZM7.97851 1.64062L7.91504 1.87012L7.17285 4.45312C5.20508 5.20996 3.80859 7.11914 3.80859 9.35059C3.80859 11.9043 5.4834 14.0332 7.88086 14.502V17.1191C4.07715 16.6064 1.26953 13.3008 1.26953 9.35547C1.26953 5.4248 4.18945 2.16797 7.97851 1.64062ZM23.1836 23.4766C22.6367 24.0234 22.0557 24.0771 21.7871 23.9893C21.5234 23.9014 20.4639 23.0176 18.8379 21.8213C17.2119 20.6201 17.1973 20.0781 16.7383 19.0527C16.2793 18.0322 15.2539 16.9727 13.9307 16.4941L13.457 15.7764C12.251 16.6016 10.8691 17.0898 9.4873 17.1777L9.58984 16.8555L10.3662 14.4385C12.6367 13.8574 14.3164 11.8018 14.3164 9.35059C14.3164 6.68945 12.4414 4.36523 9.62891 4.12109V1.57715C13.6914 1.82617 16.8945 5.21484 16.8945 9.35547C16.8945 10.9961 16.3477 12.5146 15.4785 13.7695L16.1914 14.2383C16.6699 15.5615 17.7295 16.582 18.75 17.041C19.7705 17.5 20.3223 17.5146 21.5234 19.1406C22.7246 20.7617 23.6084 21.8213 23.6963 22.085C23.7842 22.3486 23.7305 22.9297 23.1836 23.4766ZM22.7002 22.6025C22.7002 22.3877 22.5244 22.2119 22.3096 22.2119C22.0947 22.2119 21.9189 22.3877 21.9189 22.6025C21.9189 22.8174 22.0947 22.9932 22.3096 22.9932C22.5244 22.9932 22.7002 22.8174 22.7002 22.6025Z" fill="var(--color-text-primary)"/>
                  </svg>
                </div>

                <div className="serials-filter-group serials-director-filter">
                  <label className="serials-filter-label">РљРёРЅРѕСЂРµР¶РёСЃС‘СЂ</label>
                  <input
                    type="text"
                    className="serials-filter-input"
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

              <div className="serials-genre-tags">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`serials-genre-tag ${selectedGenres.includes(genre) ? 'serials-selected' : ''}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="serials-grid-section">
            <h2 className="serials-section-title">Р”РѕСЂР°РјС‹</h2>
            
            <div className="serials-grid">
              {renderDoramas()}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Serials;
