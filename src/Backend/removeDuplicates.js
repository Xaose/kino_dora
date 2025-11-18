import { moviesService, getAllDocuments } from './database';
import { getCurrentUser } from './authService';

/**
 * Функция для поиска и удаления дубликатов фильмов
 * Дубликаты определяются по названию (с учетом регистра)
 */
export const removeDuplicateMovies = async () => {
  try {
    // Проверяем авторизацию
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Для удаления дубликатов необходимо войти в систему');
    }

    console.log('Начинаю поиск дубликатов фильмов...');
    console.log('Пользователь:', user.email);

    // Получаем все фильмы (сырые данные для доступа к createdAt)
    const rawMovies = await getAllDocuments('movies');
    console.log(`Всего фильмов в базе: ${rawMovies.length}`);

    // Нормализуем названия для сравнения
    const moviesByTitle = {};
    
    rawMovies.forEach((movie) => {
      // Используем name или title для сравнения
      const title = (movie.name || movie.title || '').trim().toLowerCase();
      if (!title) return; // Пропускаем фильмы без названия
      
      if (!moviesByTitle[title]) {
        moviesByTitle[title] = [];
      }
      moviesByTitle[title].push(movie);
    });

    // Находим дубликаты (названия с более чем одним фильмом)
    const duplicates = {};
    let totalDuplicates = 0;

    Object.keys(moviesByTitle).forEach((title) => {
      if (moviesByTitle[title].length > 1) {
        duplicates[title] = moviesByTitle[title];
        totalDuplicates += moviesByTitle[title].length - 1; // -1 потому что один оставляем
      }
    });

    console.log(`\nНайдено ${Object.keys(duplicates).length} уникальных названий с дубликатами`);
    console.log(`Всего дубликатов для удаления: ${totalDuplicates}`);

    if (Object.keys(duplicates).length === 0) {
      console.log('вњ“ Дубликаты не найдены!');
      return {
        success: true,
        duplicatesFound: 0,
        duplicatesRemoved: 0,
        message: 'Дубликаты не найдены'
      };
    }

    // Показываем найденные дубликаты
    console.log('\n=== Найденные дубликаты ===');
    Object.keys(duplicates).forEach((title) => {
      const movies = duplicates[title];
      const displayTitle = movies[0].name || movies[0].title || 'Без названия';
      console.log(`\n"${displayTitle}" (${movies.length} копий):`);
      movies.forEach((movie, index) => {
        let dateStr = 'неизвестно';
        if (movie.createdAt) {
          try {
            if (movie.createdAt.toDate) {
              dateStr = movie.createdAt.toDate().toLocaleString('ru-RU');
            } else if (movie.createdAt.seconds) {
              dateStr = new Date(movie.createdAt.seconds * 1000).toLocaleString('ru-RU');
            } else if (typeof movie.createdAt === 'string') {
              dateStr = new Date(movie.createdAt).toLocaleString('ru-RU');
            }
          } catch (e) {
            dateStr = 'неизвестно';
          }
        }
        console.log(`  ${index + 1}. ID: ${movie.id}, создан: ${dateStr}`);
      });
    });

    // Удаляем дубликаты (оставляем самый новый, удаляем остальные)
    const results = [];
    let removedCount = 0;

    for (const title of Object.keys(duplicates)) {
      const movies = duplicates[title];
      
      // Сортируем по дате создания (самый новый первый)
      movies.sort((a, b) => {
        let dateA = new Date(0);
        let dateB = new Date(0);
        
        // Обрабатываем Timestamp из Firestore
        if (a.createdAt) {
          if (a.createdAt.toDate) {
            dateA = a.createdAt.toDate();
          } else if (a.createdAt.seconds) {
            dateA = new Date(a.createdAt.seconds * 1000);
          } else if (typeof a.createdAt === 'string') {
            dateA = new Date(a.createdAt);
          }
        }
        
        if (b.createdAt) {
          if (b.createdAt.toDate) {
            dateB = b.createdAt.toDate();
          } else if (b.createdAt.seconds) {
            dateB = new Date(b.createdAt.seconds * 1000);
          } else if (typeof b.createdAt === 'string') {
            dateB = new Date(b.createdAt);
          }
        }
        
        return dateB.getTime() - dateA.getTime(); // Новые первыми
      });

      // Оставляем первый (самый новый), удаляем остальные
      const toKeep = movies[0];
      const toRemove = movies.slice(1);

      const keepTitle = toKeep.name || toKeep.title || 'Без названия';
      console.log(`\nОставляем: "${keepTitle}" (ID: ${toKeep.id})`);
      
      for (const movie of toRemove) {
        try {
          await moviesService.delete(movie.id);
          removedCount++;
          const movieTitle = movie.name || movie.title || 'Без названия';
          console.log(`  вњ“ Удален дубликат: "${movieTitle}" (ID: ${movie.id})`);
          results.push({
            success: true,
            title: movieTitle,
            id: movie.id,
            action: 'deleted'
          });
        } catch (error) {
          const movieTitle = movie.name || movie.title || 'Без названия';
          console.error(`  вњ— Ошибка при удалении "${movieTitle}" (ID: ${movie.id}):`, error);
          results.push({
            success: false,
            title: movieTitle,
            id: movie.id,
            error: error.message,
            action: 'delete_failed'
          });
        }
      }
    }

    console.log(`\n=== Результаты ===`);
    console.log(`вњ“ Успешно удалено дубликатов: ${removedCount}`);
    console.log(`вњ— Ошибок при удалении: ${results.filter(r => !r.success).length}`);

    return {
      success: true,
      duplicatesFound: totalDuplicates,
      duplicatesRemoved: removedCount,
      results: results,
      message: `Удалено ${removedCount} дубликатов из ${totalDuplicates} найденных`
    };
  } catch (error) {
    console.error('Критическая ошибка при удалении дубликатов:', error);
    throw error;
  }
};

// Делаем функцию доступной в консоли браузера
if (typeof window !== 'undefined') {
  window.removeDuplicateMovies = removeDuplicateMovies;
  console.log('Функция removeDuplicateMovies() доступна в консоли. Вызовите её для удаления дубликатов.');
}

