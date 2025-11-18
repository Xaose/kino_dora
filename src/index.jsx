import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { addMoviesToFirebase } from './Backend/addMovies';
import { addDoramasToFirebase } from './Backend/addDoramas';
import { removeDuplicateMovies } from './Backend/removeDuplicates';

import Header from './Components/Header/Header';
import FAQ from './Components/FAQ/FAQ';
import Studios from './Components/Studios/Studios';
import Footer from './Components/Footer/Footer';

import Home from './Pages/Home/Home';
import Movies from './Pages/Movies/Movies';
import Serials from './Pages/Serials/Serials';
import Contact from './Pages/Contact/Contact';
import MovieShow from './Pages/MovieShow/MovieShow';
import Playing from './Pages/Playing/Playing';
import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import Profile from './Pages/Profile/Profile';
import AddMovies from './Pages/AddMovies/AddMovies';
import RemoveDuplicates from './Pages/RemoveDuplicates/RemoveDuplicates';
import Pricing from './Pages/Pricing/Pricing';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleNavigate = (page, targetId, options = {}) => {
    if (options.movieId) {
      setSelectedMovieId(options.movieId);
    }

    setCurrentPage(page);

    if (!targetId) {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      return;
    }

    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 100;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = Math.max(0, elementPosition - headerOffset);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Home onNavigate={handleNavigate} />
            <div className="gradient-section">
              <FAQ />
              <Studios />
              <Footer />
            </div>
          </>
        );
      case 'movies':
        return <Movies onNavigate={handleNavigate} />;
      case 'serials':
        return <Serials onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'movieshow':
        return <MovieShow onNavigate={handleNavigate} selectedMovieId={selectedMovieId} />;
      case 'playing':
        return <Playing onNavigate={handleNavigate} selectedMovieId={selectedMovieId} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'addmovies':
        return <AddMovies onNavigate={handleNavigate} />;
      case 'removeduplicates':
        return <RemoveDuplicates onNavigate={handleNavigate} />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      default:
        return (
          <>
            <Home onNavigate={handleNavigate} />
            <div className="gradient-section">
              <FAQ />
              <Studios />
              <Footer />
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      {renderPage()}
    </>
  );
}

if (typeof window !== 'undefined') {
  window.addMoviesToFirebase = addMoviesToFirebase;
  window.addDoramasToFirebase = addDoramasToFirebase;
  window.removeDuplicateMovies = removeDuplicateMovies;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
