import { useState, useEffect } from 'react';
import { addMoviesToFirebase } from '../../Backend/addMovies';
import { getCurrentUser, onAuthStateChange } from '../../Backend/authService';
import './AddMovies.scss';

function AddMovies({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // РџСЂРѕРІРµСЂСЏРµРј С‚РµРєСѓС‰РµРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCheckingAuth(false);
    } else {
      // РџРѕРґРїРёСЃС‹РІР°РµРјСЃСЏ РЅР° РёР·РјРµРЅРµРЅРёСЏ СЃРѕСЃС‚РѕСЏРЅРёСЏ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user);
        setCheckingAuth(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleAddMovies = async () => {
    if (!user) {
      alert('Р”Р»СЏ РґРѕР±Р°РІР»РµРЅРёСЏ С„РёР»СЊРјРѕРІ РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ');
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    setLoading(true);
    setResults(null);
    
    try {
      const results = await addMoviesToFirebase();
      setResults(results);
      alert('Р¤РёР»СЊРјС‹ СѓСЃРїРµС€РЅРѕ РґРѕР±Р°РІР»РµРЅС‹! РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅСЃРѕР»СЊ РґР»СЏ РґРµС‚Р°Р»РµР№.');
    } catch (error) {
      console.error('РћС€РёР±РєР°:', error);
      alert('РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё РґРѕР±Р°РІР»РµРЅРёРё С„РёР»СЊРјРѕРІ. РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅСЃРѕР»СЊ.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <div className="add-movies-page">
      <div className="add-movies-container">
        <button className="back-button" onClick={handleBack}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8606 22.2372L3.42738 13.7954M3.42738 13.7954L11.8691 5.36219M3.42738 13.7954L23.6774 13.8057" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>Р”РѕР±Р°РІР»РµРЅРёРµ С„РёР»СЊРјРѕРІ РІ Firebase</h1>
        
        {checkingAuth ? (
          <p>РџСЂРѕРІРµСЂРєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё...</p>
        ) : !user ? (
          <div className="auth-required">
            <p style={{ color: '#ff4d4d', marginBottom: '20px' }}>
              Р”Р»СЏ РґРѕР±Р°РІР»РµРЅРёСЏ С„РёР»СЊРјРѕРІ РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ
            </p>
            <button 
              onClick={handleLogin}
              className="add-movies-button"
            >
              Р’РѕР№С‚Рё
            </button>
          </div>
        ) : (
          <>
            <p>Р­С‚РѕС‚ РёРЅСЃС‚СЂСѓРјРµРЅС‚ РґРѕР±Р°РІРёС‚ 20 С„РёР»СЊРјРѕРІ РІ Р±Р°Р·Сѓ РґР°РЅРЅС‹С… Firebase.</p>
            <p style={{ color: '#228EE5', marginTop: '10px' }}>
              Р’С‹ РІРѕС€Р»Рё РєР°Рє: {user.email || user.displayName || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}
            </p>
            
            <button 
              onClick={handleAddMovies} 
              disabled={loading}
              className="add-movies-button"
            >
              {loading ? 'Р”РѕР±Р°РІР»РµРЅРёРµ...' : 'Р”РѕР±Р°РІРёС‚СЊ 20 С„РёР»СЊРјРѕРІ'}
            </button>
          </>
        )}

        {results && (
          <div className="results">
            <h2>Р РµР·СѓР»СЊС‚Р°С‚С‹:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index} className={result.success ? 'success' : 'error'}>
                  {result.success ? 'вњ“' : 'вњ—'} {result.title}
                  {result.success && <span className="id"> (ID: {result.id})</span>}
                  {!result.success && <span className="error-msg"> - {result.error}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="info">
          <h3>Р”РѕР±Р°РІР»СЏРµРјС‹Рµ С„РёР»СЊРјС‹ (20):</h3>
          <ul>
            <li>РРЅС‚РµСЂСЃС‚РµР»Р»Р°СЂ (2014)</li>
            <li>РќР°С‡Р°Р»Рѕ (2010)</li>
            <li>РњР°С‚СЂРёС†Р° (1999)</li>
            <li>РџРѕР±РµРі РёР· РЁРѕСѓС€РµРЅРєР° (1994)</li>
            <li>Р¤РѕСЂСЂРµСЃС‚ Р“Р°РјРї (1994)</li>
            <li>РР»Р»СЋР·РёСЏ РѕР±РјР°РЅР° (2013)</li>
            <li>РР»Р»СЋР·РёСЏ РѕР±РјР°РЅР° 2 (2016)</li>
            <li>РР»Р»СЋР·РёСЏ РѕР±РјР°РЅР° 3 (2024)</li>
            <li>РўРµРјРЅС‹Р№ СЂС‹С†Р°СЂСЊ (2008)</li>
            <li>РљСЂРёРјРёРЅР°Р»СЊРЅРѕРµ С‡С‚РёРІРѕ (1994)</li>
            <li>Р‘РѕР№С†РѕРІСЃРєРёР№ РєР»СѓР± (1999)</li>
            <li>Р—РµР»РµРЅР°СЏ РјРёР»СЏ (1999)</li>
            <li>РЎРїРёСЃРѕРє РЁРёРЅРґР»РµСЂР° (1993)</li>
            <li>Р’Р»Р°СЃС‚РµР»РёРЅ РєРѕР»РµС†: Р‘СЂР°С‚СЃС‚РІРѕ РєРѕР»СЊС†Р° (2001)</li>
            <li>Р“Р»Р°РґРёР°С‚РѕСЂ (2000)</li>
            <li>РўРёС‚Р°РЅРёРє (1997)</li>
            <li>РџРёСЂР°С‚С‹ РљР°СЂРёР±СЃРєРѕРіРѕ РјРѕСЂСЏ (2003)</li>
            <li>РђРІР°С‚Р°СЂ (2009)</li>
            <li>РњСЃС‚РёС‚РµР»Рё (2012)</li>
            <li>Р”СЋРЅР° (2021)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddMovies;

