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

  const handleRemoveDuplicates = async () => {
    if (!user) {
      alert('Для удаления дубликатов необходимо войти в систему');
      if (onNavigate) {
        onNavigate('login');
      }
      return;
    }

    const confirmed = window.confirm(
      'Вы уверены, что хотите удалить дубликаты фильмов?\n\n' +
      'Будут удалены все дубликаты, оставлен только самый новый экземпляр каждого фильма.'
    );

    if (!confirmed) return;

    setLoading(true);
    setResults(null);
    
    try {
      const result = await removeDuplicateMovies();
      setResults(result);
      if (result.success) {
        alert(result.message || 'Дубликаты успешно удалены!');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при удалении дубликатов. Проверьте консоль.');
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
        <h1>Удаление дубликатов фильмов</h1>
        
        {checkingAuth ? (
          <p>Проверка авторизации...</p>
        ) : !user ? (
          <div className="auth-required">
            <p style={{ color: '#ff4d4d', marginBottom: '20px' }}>
              Для удаления дубликатов необходимо войти в систему
            </p>
            <button 
              onClick={handleLogin}
              className="remove-duplicates-button"
            >
              Войти
            </button>
          </div>
        ) : (
          <>
            <p>Эта утилита найдет и удалит дубликаты фильмов в базе данных Firebase.</p>
            <p style={{ color: '#228EE5', marginTop: '10px' }}>
              Вы вошли как: {user.email || user.displayName || 'Пользователь'}
            </p>
            <p style={{ color: '#ffaa00', marginTop: '20px', fontSize: '14px' }}>
              вљ пёЏ Внимание: Будут удалены все дубликаты. Для каждого названия останется только самый новый экземпляр.
            </p>
            
            <button 
              onClick={handleRemoveDuplicates} 
              disabled={loading}
              className="remove-duplicates-button"
            >
              {loading ? 'Удаление дубликатов...' : 'Найти и удалить дубликаты'}
            </button>
          </>
        )}

        {results && (
          <div className="results">
            <h2>Результаты:</h2>
            <div className="summary">
              <p><strong>Найдено дубликатов:</strong> {results.duplicatesFound || 0}</p>
              <p><strong>Удалено:</strong> {results.duplicatesRemoved || 0}</p>
              <p><strong>Ошибок:</strong> {results.results?.filter(r => !r.success).length || 0}</p>
            </div>
            
            {results.results && results.results.length > 0 && (
              <div className="details">
                <h3>Детали:</h3>
                <ul>
                  {results.results.map((result, index) => (
                    <li key={index} className={result.success ? 'success' : 'error'}>
                      {result.success ? 'вњ“' : 'вњ—'} {result.title}
                      {result.success && <span className="id"> (ID: {result.id}) - удален</span>}
                      {!result.success && <span className="error-msg"> - ошибка: {result.error}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="info">
          <h3>Как это работает:</h3>
          <ul>
            <li>Функция находит все фильмы с одинаковыми названиями</li>
            <li>Для каждого названия оставляется самый новый экземпляр (по дате создания)</li>
            <li>Все остальные дубликаты удаляются</li>
            <li>Процесс можно запустить из консоли: <code>await removeDuplicateMovies()</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RemoveDuplicates;

