import { useState, useEffect } from 'react';
import { removeDuplicateMovies } from '../../Backend/removeDuplicates';
import { getCurrentUser, onAuthStateChange } from '../../Backend/authService';
import './RemoveDuplicates.scss';

function RemoveDuplicates({ onNavigate }) {
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

  const handleRemoveDuplicates = async () => {
    if (!user) {
      alert('Р”Р»СЏ СѓРґР°Р»РµРЅРёСЏ РґСѓР±Р»РёРєР°С‚РѕРІ РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ');
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    const confirmed = window.confirm(
      'Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ СѓРґР°Р»РёС‚СЊ РґСѓР±Р»РёРєР°С‚С‹ С„РёР»СЊРјРѕРІ?\n\n' +
      'Р‘СѓРґСѓС‚ СѓРґР°Р»РµРЅС‹ РІСЃРµ РґСѓР±Р»РёРєР°С‚С‹, РѕСЃС‚Р°РІР»РµРЅ С‚РѕР»СЊРєРѕ СЃР°РјС‹Р№ РЅРѕРІС‹Р№ СЌРєР·РµРјРїР»СЏСЂ РєР°Р¶РґРѕРіРѕ С„РёР»СЊРјР°.'
    );

    if (!confirmed) return;

    setLoading(true);
    setResults(null);
    
    try {
      const result = await removeDuplicateMovies();
      setResults(result);
      if (result.success) {
        alert(result.message || 'Р”СѓР±Р»РёРєР°С‚С‹ СѓСЃРїРµС€РЅРѕ СѓРґР°Р»РµРЅС‹!');
      }
    } catch (error) {
      console.error('РћС€РёР±РєР°:', error);
      alert('РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё РґСѓР±Р»РёРєР°С‚РѕРІ. РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅСЃРѕР»СЊ.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('home');
    }
  };

  const handleLogin = () => {
    if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="remove-duplicates-page">
      <div className="remove-duplicates-container">
        <button className="back-button" onClick={handleBack}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8606 22.2372L3.42738 13.7954M3.42738 13.7954L11.8691 5.36219M3.42738 13.7954L23.6774 13.8057" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>РЈРґР°Р»РµРЅРёРµ РґСѓР±Р»РёРєР°С‚РѕРІ С„РёР»СЊРјРѕРІ</h1>
        
        {checkingAuth ? (
          <p>РџСЂРѕРІРµСЂРєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё...</p>
        ) : !user ? (
          <div className="auth-required">
            <p style={{ color: '#ff4d4d', marginBottom: '20px' }}>
              Р”Р»СЏ СѓРґР°Р»РµРЅРёСЏ РґСѓР±Р»РёРєР°С‚РѕРІ РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ
            </p>
            <button 
              onClick={handleLogin}
              className="remove-duplicates-button"
            >
              Р’РѕР№С‚Рё
            </button>
          </div>
        ) : (
          <>
            <p>Р­С‚Р° СѓС‚РёР»РёС‚Р° РЅР°Р№РґРµС‚ Рё СѓРґР°Р»РёС‚ РґСѓР±Р»РёРєР°С‚С‹ С„РёР»СЊРјРѕРІ РІ Р±Р°Р·Рµ РґР°РЅРЅС‹С… Firebase.</p>
            <p style={{ color: '#228EE5', marginTop: '10px' }}>
              Р’С‹ РІРѕС€Р»Рё РєР°Рє: {user.email || user.displayName || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}
            </p>
            <p style={{ color: '#ffaa00', marginTop: '20px', fontSize: '14px' }}>
              вљ пёЏ Р’РЅРёРјР°РЅРёРµ: Р‘СѓРґСѓС‚ СѓРґР°Р»РµРЅС‹ РІСЃРµ РґСѓР±Р»РёРєР°С‚С‹. Р”Р»СЏ РєР°Р¶РґРѕРіРѕ РЅР°Р·РІР°РЅРёСЏ РѕСЃС‚Р°РЅРµС‚СЃСЏ С‚РѕР»СЊРєРѕ СЃР°РјС‹Р№ РЅРѕРІС‹Р№ СЌРєР·РµРјРїР»СЏСЂ.
            </p>
            
            <button 
              onClick={handleRemoveDuplicates} 
              disabled={loading}
              className="remove-duplicates-button"
            >
              {loading ? 'РЈРґР°Р»РµРЅРёРµ РґСѓР±Р»РёРєР°С‚РѕРІ...' : 'РќР°Р№С‚Рё Рё СѓРґР°Р»РёС‚СЊ РґСѓР±Р»РёРєР°С‚С‹'}
            </button>
          </>
        )}

        {results && (
          <div className="results">
            <h2>Р РµР·СѓР»СЊС‚Р°С‚С‹:</h2>
            <div className="summary">
              <p><strong>РќР°Р№РґРµРЅРѕ РґСѓР±Р»РёРєР°С‚РѕРІ:</strong> {results.duplicatesFound || 0}</p>
              <p><strong>РЈРґР°Р»РµРЅРѕ:</strong> {results.duplicatesRemoved || 0}</p>
              <p><strong>РћС€РёР±РѕРє:</strong> {results.results?.filter(r => !r.success).length || 0}</p>
            </div>
            
            {results.results && results.results.length > 0 && (
              <div className="details">
                <h3>Р”РµС‚Р°Р»Рё:</h3>
                <ul>
                  {results.results.map((result, index) => (
                    <li key={index} className={result.success ? 'success' : 'error'}>
                      {result.success ? 'вњ“' : 'вњ—'} {result.title}
                      {result.success && <span className="id"> (ID: {result.id}) - СѓРґР°Р»РµРЅ</span>}
                      {!result.success && <span className="error-msg"> - РѕС€РёР±РєР°: {result.error}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="info">
          <h3>РљР°Рє СЌС‚Рѕ СЂР°Р±РѕС‚Р°РµС‚:</h3>
          <ul>
            <li>Р¤СѓРЅРєС†РёСЏ РЅР°С…РѕРґРёС‚ РІСЃРµ С„РёР»СЊРјС‹ СЃ РѕРґРёРЅР°РєРѕРІС‹РјРё РЅР°Р·РІР°РЅРёСЏРјРё</li>
            <li>Р”Р»СЏ РєР°Р¶РґРѕРіРѕ РЅР°Р·РІР°РЅРёСЏ РѕСЃС‚Р°РІР»СЏРµС‚СЃСЏ СЃР°РјС‹Р№ РЅРѕРІС‹Р№ СЌРєР·РµРјРїР»СЏСЂ (РїРѕ РґР°С‚Рµ СЃРѕР·РґР°РЅРёСЏ)</li>
            <li>Р’СЃРµ РѕСЃС‚Р°Р»СЊРЅС‹Рµ РґСѓР±Р»РёРєР°С‚С‹ СѓРґР°Р»СЏСЋС‚СЃСЏ</li>
            <li>РџСЂРѕС†РµСЃСЃ РјРѕР¶РЅРѕ Р·Р°РїСѓСЃС‚РёС‚СЊ РёР· РєРѕРЅСЃРѕР»Рё: <code>await removeDuplicateMovies()</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RemoveDuplicates;

