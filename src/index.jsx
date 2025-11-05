import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer.jsx';
import FAQ from './Components/FAQ/FAQ.jsx';
import Studios from './Components/Studios/Studios.jsx';
import Home from './Pages/Home/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Home />
    <div className="gradient-section">
      <FAQ />
      <Studios />
      <Footer />
    </div>
  </React.StrictMode>
);
