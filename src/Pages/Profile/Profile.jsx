import { useState, useEffect, useRef } from 'react';
import './Profile.scss';
import { getCurrentUser, onAuthStateChange, updateUserProfile, logoutUser } from '../../Backend/authService';
import { getFavorites } from '../../Backend/favoritesService';
import { moviesService } from '../../Backend/database';

const POSTER_PLACEHOLDER = 'https://via.placeholder.com/300x450?text=No+Poster';

function Profile({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' РёР»Рё 'favorites'
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [customAvatarDataUrl, setCustomAvatarDataUrl] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesMovies, setFavoritesMovies] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        setUserData(user);
        setFormData({
          name: user.name || '',
          username: user.username || '',
          email: user.email || ''
        });
        setLoading(false);
        loadFavorites(user.uid);
      } else {
        // Р•СЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ, РїРµСЂРµРЅР°РїСЂР°РІР»СЏРµРј РЅР° СЃС‚СЂР°РЅРёС†Сѓ РІС…РѕРґР°
        if (onNavigate) {
          onNavigate('login');
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [onNavigate]);

  const loadFavorites = async (userId) => {
    setLoadingFavorites(true);
    try {
      const result = await getFavorites(userId);
      if (result.success) {
        setFavorites(result.favorites || []);
        
        // Р—Р°РіСЂСѓР¶Р°РµРј РґР°РЅРЅС‹Рµ С„РёР»СЊРјРѕРІ
        if (result.favorites && result.favorites.length > 0) {
          const moviesPromises = result.favorites.map(movieId => 
            moviesService.getById(movieId).catch(() => null)
          );
          const movies = await Promise.all(moviesPromises);
          setFavoritesMovies(movies.filter(Boolean));
        } else {
          setFavoritesMovies([]);
        }
      }
    } catch (err) {
      console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РёР·Р±СЂР°РЅРЅРѕРіРѕ:', err);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userData?.name || '',
      username: userData?.username || '',
      email: userData?.email || ''
    });
    setCustomAvatarDataUrl(null);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // РџСЂРѕРІРµСЂРєР° С‚РёРїР° С„Р°Р№Р»Р°
    if (!file.type || !file.type.startsWith('image/')) {
      setError('Р’С‹Р±РµСЂРёС‚Рµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ');
      return;
    }

    // РџСЂРѕРІРµСЂРєР° СЂР°Р·РјРµСЂР° (РјР°РєСЃРёРјСѓРј 2MB РґР»СЏ data URL, С‡С‚РѕР±С‹ РЅРµ РїРµСЂРµРіСЂСѓР¶Р°С‚СЊ Firestore)
    if (file.size > 2 * 1024 * 1024) {
      setError('Р Р°Р·РјРµСЂ С„Р°Р№Р»Р° РЅРµ РґРѕР»Р¶РµРЅ РїСЂРµРІС‹С€Р°С‚СЊ 2MB');
      return;
    }

    setError('');

    // РџСЂРµРѕР±СЂР°Р·СѓРµРј С„Р°Р№Р» РІ data URL (base64)
    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result СЃРѕРґРµСЂР¶РёС‚ data URL (РЅР°РїСЂРёРјРµСЂ: "data:image/jpeg;base64,/9j/4AAQ...")
      setCustomAvatarDataUrl(reader.result);
    };
    reader.onerror = () => {
      setError('РћС€РёР±РєР° РїСЂРё С‡С‚РµРЅРёРё С„Р°Р№Р»Р°');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updates = {};

      // РћР±РЅРѕРІР»СЏРµРј РёРјСЏ
      if (formData.name !== userData?.name) {
        updates.name = formData.name;
      }

      // РћР±РЅРѕРІР»СЏРµРј Р»РѕРіРёРЅ
      if (formData.username !== userData?.username) {
        updates.username = formData.username;
      }

      // РЎРѕС…СЂР°РЅСЏРµРј Р°РІР°С‚Р°СЂ РєР°Рє data URL (base64) РїСЂСЏРјРѕ РІ Firestore
      if (customAvatarDataUrl) {
        // customAvatarDataUrl СѓР¶Рµ СЃРѕРґРµСЂР¶РёС‚ РїРѕР»РЅС‹Р№ data URL (РЅР°РїСЂРёРјРµСЂ: "data:image/jpeg;base64,...")
        updates.profileImage = customAvatarDataUrl;
      }

      // РЎРѕС…СЂР°РЅСЏРµРј РёР·РјРµРЅРµРЅРёСЏ
      if (Object.keys(updates).length > 0) {
        const result = await updateUserProfile(user.uid, updates);
        if (!result.success) {
          throw new Error(result.error || 'РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ РїСЂРѕС„РёР»СЏ');
        }

        // РћР±РЅРѕРІР»СЏРµРј Р»РѕРєР°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ
        const updatedUserData = { ...userData, ...updates };
        setUserData(updatedUserData);
        setFormData({
          name: updatedUserData.name || '',
          username: updatedUserData.username || '',
          email: updatedUserData.email || ''
        });
        setCustomAvatarDataUrl(null);
        setSuccess('РџСЂРѕС„РёР»СЊ СѓСЃРїРµС€РЅРѕ РѕР±РЅРѕРІР»РµРЅ');
        setEditing(false);
      } else {
        setEditing(false);
      }
    } catch (err) {
      setError(err.message || 'РћС€РёР±РєР° РїСЂРё СЃРѕС…СЂР°РЅРµРЅРёРё');
      console.error('РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ РїСЂРѕС„РёР»СЏ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await logoutUser();
      if (result.success) {
        if (onNavigate) {
          onNavigate('home');
        }
      } else {
        setError(result.error || 'РћС€РёР±РєР° РїСЂРё РІС‹С…РѕРґРµ');
      }
    } catch (err) {
      setError('РћС€РёР±РєР° РїСЂРё РІС‹С…РѕРґРµ');
      console.error('РћС€РёР±РєР° РІС‹С…РѕРґР°:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPosterSrc = (movie) => movie.posterUrl || POSTER_PLACEHOLDER;

  const handleMovieClick = (movieId) => {
    if (onNavigate) {
      onNavigate('movieshow', null, { movieId });
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-message">Р—Р°РіСЂСѓР·РєР°...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Р РµРґРёСЂРµРєС‚ СѓР¶Рµ РїСЂРѕРёР·РѕС€РµР»
  }

  // РСЃРїРѕР»СЊР·СѓРµРј РЅРѕРІС‹Р№ Р°РІР°С‚Р°СЂ РёР· РїСЂРµРІСЊСЋ РёР»Рё СЃРѕС…СЂР°РЅРµРЅРЅС‹Р№ РІ РїСЂРѕС„РёР»Рµ
  // Data URL РјРѕР¶РµС‚ Р±С‹С‚СЊ РєР°Рє РёР· customAvatarDataUrl (РЅРѕРІС‹Р№, РµС‰Рµ РЅРµ СЃРѕС…СЂР°РЅРµРЅРЅС‹Р№), С‚Р°Рє Рё РёР· userData.profileImage (СѓР¶Рµ СЃРѕС…СЂР°РЅРµРЅРЅС‹Р№)
  const avatarUrl = customAvatarDataUrl || userData?.profileImage || null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <button className="back-button" onClick={() => onNavigate('home')}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8606 22.2372L3.42738 13.7954M3.42738 13.7954L11.8691 5.36219M3.42738 13.7954L23.6774 13.8057" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="profile-tabs">
          <div 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            РџСЂРѕС„РёР»СЊ
          </div>
          <div 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            РР·Р±СЂР°РЅРЅРѕРµ
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-content">
            <div className="user-avatar-wrapper">
              <div 
                className={`user-avatar ${editing ? 'editable' : ''}`}
                onClick={handleAvatarClick}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="avatar-image" />
                ) : (
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M62.5003 50C62.5003 29.2893 79.2896 12.5 100 12.5C120.711 12.5 137.5 29.2893 137.5 50C137.5 70.7107 120.711 87.5 100 87.5C79.2896 87.5 62.5003 70.7107 62.5003 50Z" fill="var(--color-text-primary)"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M31.2607 167.544C31.9052 130.13 62.4335 100 100 100C137.568 100 168.097 130.131 168.74 167.547C168.783 170.028 167.353 172.3 165.097 173.335C145.273 182.432 123.221 187.5 100.003 187.5C76.7825 187.5 54.7289 182.431 34.903 173.332C32.6474 172.297 31.218 170.026 31.2607 167.544Z" fill="var(--color-text-primary)"/>
                  </svg>
                )}
                {editing && (
                  <div className="avatar-edit-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4L4 12V20H12L20 12L12 4Z" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 16L16 8" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <h2 className="username">{userData?.name || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}</h2>

            {!editing ? (
              <div className="profile-info">
                <div className="info-item">
                  <label>РРјСЏ:</label>
                  <span>{userData?.name || 'РќРµ СѓРєР°Р·Р°РЅРѕ'}</span>
                </div>
                <div className="info-item">
                  <label>Р›РѕРіРёРЅ:</label>
                  <span>{userData?.username || 'РќРµ СѓРєР°Р·Р°РЅРѕ'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userData?.email || 'РќРµ СѓРєР°Р·Р°РЅРѕ'}</span>
                </div>
              </div>
            ) : (
              <div className="profile-form">
                <div className="form-field">
                  <label>РРјСЏ:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Р’РІРµРґРёС‚Рµ РёРјСЏ"
                  />
                </div>
                <div className="form-field">
                  <label>Р›РѕРіРёРЅ:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Р’РІРµРґРёС‚Рµ Р»РѕРіРёРЅ"
                  />
                </div>
                <div className="form-field">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder="Email РЅРµР»СЊР·СЏ РёР·РјРµРЅРёС‚СЊ"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}

            {success && (
              <div className="success-message">{success}</div>
            )}

            <div className="profile-actions">
              {!editing ? (
                <>
                  <button className="edit-button" onClick={handleEdit} disabled={loading}>
                    Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ РїСЂРѕС„РёР»СЊ
                  </button>
                  <button className="logout-button" onClick={handleLogout} disabled={loading}>
                    Р’С‹Р№С‚Рё
                  </button>
                </>
              ) : (
                <>
                  <button className="save-button" onClick={handleSave} disabled={loading}>
                    {loading ? 'РЎРѕС…СЂР°РЅРµРЅРёРµ...' : 'РЎРѕС…СЂР°РЅРёС‚СЊ'}
                  </button>
                  <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                    РћС‚РјРµРЅР°
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-content">
            <h2 className="favorites-title">РР·Р±СЂР°РЅРЅС‹Рµ С„РёР»СЊРјС‹</h2>
            {loadingFavorites ? (
              <div className="loading-message">Р—Р°РіСЂСѓР·РєР°...</div>
            ) : favoritesMovies.length === 0 ? (
              <div className="empty-favorites">
                <p>РЈ РІР°СЃ РїРѕРєР° РЅРµС‚ РёР·Р±СЂР°РЅРЅС‹С… С„РёР»СЊРјРѕРІ</p>
                <p className="hint">РќР°Р¶РјРёС‚Рµ РЅР° РїР»СЋСЃРёРє РЅР° РєР°СЂС‚РѕС‡РєРµ С„РёР»СЊРјР°, С‡С‚РѕР±С‹ РґРѕР±Р°РІРёС‚СЊ РµРіРѕ РІ РёР·Р±СЂР°РЅРЅРѕРµ</p>
              </div>
            ) : (
              <div className="favorites-grid">
                {favoritesMovies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="favorite-movie-card"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <div className="favorite-movie-image">
                      <img
                        src={getPosterSrc(movie)}
                        alt={movie.title}
                      />
                    </div>
                    <div className="favorite-movie-info">
                      <p className="favorite-movie-title">{movie.title}</p>
                      <span className="favorite-movie-year">
                        {movie.releaseYear || 'Р“РѕРґ РЅРµ СѓРєР°Р·Р°РЅ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
