import { useState, useEffect } from 'react';
import './Home.scss';
import FAQ from '../../Components/FAQ/FAQ';
import Studios from '../../Components/Studios/Studios';
import Footer from '../../Components/Footer/Footer';

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
  const [selectedMovieGenres, setSelectedMovieGenres] = useState(['Drama', 'Action', 'Fantasy', 'Thriller']);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState(['Action', 'Adventure', 'Fantasy', 'Thriller']);

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

  const trendingMovies = [
    { id: 1, image: 'https://api.builder.io/api/v1/image/assets/TEMP/63cc4423bd528e794a76a53663beeb6aa3297757?width=422' },
    { id: 2, image: 'https://api.builder.io/api/v1/image/assets/TEMP/df4235baef7ac0a13384ae2c8cd442a19feacaf6?width=422' },
    { id: 3, image: 'https://api.builder.io/api/v1/image/assets/TEMP/2144eff44163b5ebb1f0def9adf42d5886aee6cd?width=558' },
    { id: 4, image: 'https://api.builder.io/api/v1/image/assets/TEMP/3f9d4a60f38c827392cb93d0c9feed335d0151fa?width=634' },
    { id: 5, image: 'https://api.builder.io/api/v1/image/assets/TEMP/62fa83178a9cec7b14d66a5ae1b0f01aa604e9c9?width=422' },
    { id: 6, image: 'https://api.builder.io/api/v1/image/assets/TEMP/1269ccb99d4f01832b5183c81d09f927972d9050?width=422' },
    { id: 7, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=416' },
    { id: 8, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=416' }
  ];

  const moviesList = [
    { id: 1, image: 'https://api.builder.io/api/v1/image/assets/TEMP/451d16b777f9c197719470d611f8e7ea7a6f716b?width=416' },
    { id: 2, image: 'https://api.builder.io/api/v1/image/assets/TEMP/673ec092422aeecf07aa901d9905e1609f221bdd?width=416' },
    { id: 3, image: 'https://api.builder.io/api/v1/image/assets/TEMP/e2e6e75f6546865cb00505fd31ed8f6234d930b0?width=684' },
    { id: 4, image: 'https://api.builder.io/api/v1/image/assets/TEMP/0e7e43f7bf226ed4e7378bae1638a3fcb1c412b6?width=580' },
    { id: 5, image: 'https://api.builder.io/api/v1/image/assets/TEMP/ac00b2e3577a6801a7a98a2cfb708baf2535877a?width=416' },
    { id: 6, image: 'https://api.builder.io/api/v1/image/assets/TEMP/36d5e291dc1af3d58db1c0c97bee9b8108a281e7?width=578' },
    { id: 7, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=416' },
    { id: 8, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=1318' }
  ];

  const seriesList = [
    { id: 1, image: 'https://api.builder.io/api/v1/image/assets/TEMP/ab22231e4199dd44c4e2694b86275b890a051850?width=416' },
    { id: 2, image: 'https://api.builder.io/api/v1/image/assets/TEMP/9629587e120f58a5f4b9882ff3ada4961b62d472?width=416' },
    { id: 3, image: 'https://api.builder.io/api/v1/image/assets/TEMP/c37edbd49729ff584ffbdc2eb201861fbd105762?width=1106' },
    { id: 4, image: 'https://api.builder.io/api/v1/image/assets/TEMP/c6d95a719854e4dd9e2f601616ae9e5eb2957e4b?width=510' },
    { id: 5, image: 'https://api.builder.io/api/v1/image/assets/TEMP/b7ea631e1ae7df308012af880c808ad84242783f?width=416' },
    { id: 6, image: 'https://api.builder.io/api/v1/image/assets/TEMP/92d92b49f49392488b3e7fab4ed90da954b4497c?width=906' },
    { id: 7, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=416' },
    { id: 8, image: 'https://api.builder.io/api/v1/image/assets/TEMP/320ab5f2abc2e662da42d1c528a527e3c8f070ca?width=416' }
  ];

  const genres = ['Drama', 'Action', 'Adventure', 'Romance', 'Fantasy', 'Comedy', 'Animation', 'Thriller', 'Mystery', 'historical'];

  useEffect(() => {
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
            <button className="btn-watch">
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
              Смотерть
            </button>

            <button className="btn-info">
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

      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Популярное</h2>
          <button className="see-more-btn">
            Больше
            <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7407 19.8516L21.377 12.2231M21.377 12.2231L13.7485 4.58683M21.377 12.2231L3.05927 12.2138" stroke="#228EE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="movies-scroll">
          <div className="movies-list">
            {trendingMovies.map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={movie.image} alt={`Movie ${movie.id}`} />
                <button className="add-btn">
                  <svg className="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="10" y="0" width="5" height="24" rx="2" fill="#EBFAFF"/>
                    <rect x="0" y="10" width="24" height="5" rx="2" fill="#EBFAFF"/>
                  </svg>
                </button>
              </div>
            ))}
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
          <button className="scroll-btn scroll-left">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.2288 11.9476C11.9237 12.2527 11.9237 12.7473 12.2288 13.0524L20.0413 20.8649C20.3464 21.17 20.8411 21.17 21.1462 20.8649C21.4513 20.5598 21.4513 20.0652 21.1462 19.7601L13.8861 12.5L21.1462 5.23993C21.4513 4.93483 21.4513 4.44017 21.1462 4.13507C20.8411 3.82998 20.3464 3.82998 20.0413 4.13507L12.2288 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
          <div className="genres-list">
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
          <button className="scroll-btn scroll-right">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.9587 11.9476C17.2638 12.2527 17.2638 12.7473 16.9587 13.0524L9.14618 20.8649C8.84108 21.17 8.34642 21.17 8.04132 20.8649C7.73623 20.5598 7.73623 20.0652 8.04132 19.7601L15.3014 12.5L8.04132 5.23993C7.73623 4.93483 7.73623 4.44017 8.04132 4.13507C8.34642 3.82998 8.84108 3.82998 9.14618 4.13507L16.9587 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
        </div>

        <div className="movies-scroll">
          <div className="movies-list">
            {moviesList.map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={movie.image} alt={`Movie ${movie.id}`} />
                <button className="add-btn">
                  <svg className="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="10" y="0" width="5" height="24" rx="2" fill="#EBFAFF"/>
                    <rect x="0" y="10" width="24" height="5" rx="2" fill="#EBFAFF"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="series-section">
        <div className="section-backdrop"></div>
        <div className="section-header">
          <h2 className="section-title">Сериалы</h2>
          <button className="see-more-btn">
            Больше
            <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.7407 19.8514L21.377 12.2229M21.377 12.2229L13.7485 4.5867M21.377 12.2229L3.05927 12.2137" stroke="#228EE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="genres-section">
          <button className="scroll-btn scroll-left">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.2288 11.9476C11.9237 12.2527 11.9237 12.7473 12.2288 13.0524L20.0413 20.8649C20.3464 21.17 20.8411 21.17 21.1462 20.8649C21.4513 20.5598 21.4513 20.0652 21.1462 19.7601L13.8861 12.5L21.1462 5.23993C21.4513 4.93483 21.4513 4.44017 21.1462 4.13507C20.8411 3.82998 20.3464 3.82998 20.0413 4.13507L12.2288 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
          <div className="genres-list">
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
          <button className="scroll-btn scroll-right">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.9587 11.9476C17.2638 12.2527 17.2638 12.7473 16.9587 13.0524L9.14618 20.8649C8.84108 21.17 8.34642 21.17 8.04132 20.8649C7.73623 20.5598 7.73623 20.0652 8.04132 19.7601L15.3014 12.5L8.04132 5.23993C7.73623 4.93483 7.73623 4.44017 8.04132 4.13507C8.34642 3.82998 8.84108 3.82998 9.14618 4.13507L16.9587 11.9476Z" fill="#EBFAFF"/>
            </svg>
          </button>
        </div>

        <div className="movies-scroll">
          <div className="movies-list">
            {seriesList.map(series => (
              <div key={series.id} className="movie-card">
                <img src={series.image} alt={`Series ${series.id}`} />
                <button className="add-btn">
                  <svg className="plus-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="10" y="0" width="5" height="24" rx="2" fill="#EBFAFF"/>
                    <rect x="0" y="10" width="24" height="5" rx="2" fill="#EBFAFF"/>
                  </svg>
                </button>
              </div>
            ))}
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
