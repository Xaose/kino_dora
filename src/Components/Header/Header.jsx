import { useState, useEffect, useMemo, useCallback } from 'react';
import './Header.scss';
import { getCurrentUser } from '../../Backend/authService';

function Header({ onNavigate, currentPage = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.innerWidth <= 640;
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => setIsMobile(window.innerWidth <= 640);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigateTo = useCallback(
    (route, anchor) => {
      if (onNavigate) {
        onNavigate(route, anchor);
      }
      closeMobileMenu();
    },
    [onNavigate]
  );

  const navItems = useMemo(
    () => [
      { id: 'home', label: 'Главная', action: () => navigateTo('home') },
      { id: 'pricing', label: 'Цены', action: () => navigateTo('pricing') },
      { id: 'movies', label: 'Фильмы', action: () => navigateTo('movies') },
      { id: 'serials', label: 'Дорамы', action: () => navigateTo('serials') },
      { id: 'contact', label: 'Контакты', action: () => navigateTo('contact') },
      { id: 'faq', label: 'FAQ', action: () => navigateTo('home', 'faq-selection') }
    ],
    [navigateTo]
  );

  const handleLoginClick = () => {
    const user = getCurrentUser();
    if (user) {
      navigateTo('profile');
    } else {
      navigateTo('login');
    }
  };

  return (
    <header className={`header-glass ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <button className="logo-button" onClick={() => navigateTo('home')} aria-label="На главную">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/e67f705e08dc2b67ab98d48ec9340cf50c555a7b?width=160"
            alt="Kino Dora Logo"
            className={`logo ${isScrolled && isMobile ? 'hidden' : ''}`}
          />
        </button>

        <nav className="navigation" aria-label="Основная навигация">
          {navItems.map(({ id, label, action }) => (
            <button
              key={id}
              className={`nav-item ${currentPage === id ? 'nav-item-active' : ''}`}
              onClick={action}
              type="button"
            >
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="header-icons">
          <button className="icon-wrapper" aria-label="Поиск" type="button">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M28 28L21.0711 21.0711M21.0711 21.0711C22.8807 19.2614 24 16.7614 24 14C24 8.47715 19.5228 4 14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24C16.7614 24 19.2614 22.8807 21.0711 21.0711Z" stroke="#EBFAFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="icon-wrapper" onClick={handleLoginClick} aria-label="Профиль" type="button">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.0004 8C10.0004 4.68629 12.6867 2 16.0004 2C19.3142 2 22.0004 4.68629 22.0004 8C22.0004 11.3137 19.3142 14 16.0004 14C12.6867 14 10.0004 11.3137 10.0004 8Z" fill="#EBFAFF" />
              <path fillRule="evenodd" clipRule="evenodd" d="M5.0021 26.8071C5.10522 20.8208 9.98975 16 16.0004 16C22.0113 16 26.8959 20.821 26.9988 26.8075C27.0056 27.2046 26.7769 27.568 26.416 27.7336C23.2441 29.1891 19.7158 30 16.0009 30C12.2856 30 8.75702 29.1889 5.58487 27.7332C5.22398 27.5676 4.99526 27.2041 5.0021 26.8071Z" fill="#EBFAFF" />
            </svg>
          </button>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Меню"
          type="button"
        >
          <span className="hamburger" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <nav className={`mobile-navigation ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Мобильная навигация">
        {navItems.map(({ id, label, action }) => (
          <button
            key={`mobile-${id}`}
            className={`mobile-nav-item ${currentPage === id ? 'mobile-nav-item-active' : ''}`}
            onClick={action}
            type="button"
          >
            <span>{label}</span>
            <span className="mobile-nav-glow" aria-hidden="true" />
          </button>
        ))}
        <button className="mobile-nav-item" onClick={handleLoginClick} type="button">
          <span>Профиль</span>
          <span className="mobile-nav-glow" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
