import { useState, useEffect } from 'react';
import './Home.scss';

function Home() {
  const [activeIndex, setActiveIndex] = useState(1);

  const films = [
    {
      id: 1,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/ed27d917ef10dc99027445497b7502563d7c0613?width=434',
      alt: 'The Witcher Scene 1'
    },
    {
      id: 2,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/c03269ff6c3c34e6856e73832461d54d6dc06eaf?width=400',
      alt: 'The Witcher Scene 2'
    },
    {
      id: 3,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/61f5b358bce16b82a49b07c74feea842ecc21602?width=446',
      alt: 'The Witcher Scene 3'
    },
    {
      id: 4,
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/32cd0e3a2f89f021fd228271994e5cabd4211d4b?width=393',
      alt: 'The Witcher Scene 4'
    }
  ];

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
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={i < 4 ? 'star-full' : 'star-half'}
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
                {[...Array(1)].map((_, i) => (
                  <div key={`half-${i}`} className="star-half-container">
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
                ))}
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
    </div>
  );
}

export default Home;
