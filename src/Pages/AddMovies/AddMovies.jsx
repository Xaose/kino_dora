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
    // Проверяем текущего пользователя
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCheckingAuth(false);
    } else {
      // Подписываемся на изменения состояния аутентификации
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user);
        setCheckingAuth(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleAddMovies = async () => {
    if (!user) {
      alert('Для добавления фильмов необходимо войти в систему');
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
      alert('Фильмы успешно добавлены! Проверьте консоль для деталей.');
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при добавлении фильмов. Проверьте консоль.');
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
        <h1>Добавление фильмов в Firebase</h1>
        
        {checkingAuth ? (
          <p>Проверка авторизации...</p>
        ) : !user ? (
          <div className="auth-required">
            <p style={{ color: '#ff4d4d', marginBottom: '20px' }}>
              Для добавления фильмов необходимо войти в систему
            </p>
            <button 
              onClick={handleLogin}
              className="add-movies-button"
            >
              Войти
            </button>
          </div>
        ) : (
          <>
            <p>Этот инструмент добавит 20 фильмов в базу данных Firebase.</p>
            <p style={{ color: '#228EE5', marginTop: '10px' }}>
              Вы вошли как: {user.email || user.displayName || 'Пользователь'}
            </p>
            
            <button 
              onClick={handleAddMovies} 
              disabled={loading}
              className="add-movies-button"
            >
              {loading ? 'Добавление...' : 'Добавить 20 фильмов'}
            </button>
          </>
        )}

        {results && (
          <div className="results">
            <h2>Результаты:</h2>
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
          <h3>Добавляемые фильмы (20):</h3>
          <ul>
            <li>Интерстеллар (2014)</li>
            <li>Начало (2010)</li>
            <li>Матрица (1999)</li>
            <li>Побег из Шоушенка (1994)</li>
            <li>Форрест Гамп (1994)</li>
            <li>Иллюзия обмана (2013)</li>
            <li>Иллюзия обмана 2 (2016)</li>
            <li>Иллюзия обмана 3 (2024)</li>
            <li>Темный рыцарь (2008)</li>
            <li>Криминальное чтиво (1994)</li>
            <li>Бойцовский клуб (1999)</li>
            <li>Зеленая миля (1999)</li>
            <li>Список Шиндлера (1993)</li>
            <li>Властелин колец: Братство кольца (2001)</li>
            <li>Гладиатор (2000)</li>
            <li>Титаник (1997)</li>
            <li>Пираты Карибского моря (2003)</li>
            <li>Аватар (2009)</li>
            <li>Мстители (2012)</li>
            <li>Дюна (2021)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddMovies;

