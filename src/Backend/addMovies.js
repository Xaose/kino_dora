import { moviesService } from './database';
import { getCurrentUser } from './authService';

// Массив фильмов с заполненными полями
const newMovies = [
  
  {
    title: 'Ведьмак',
    description: 'Геральт из Ривии — один из последних ведьмаков, мутировавших охотников на монстров. В мире, где люди часто оказываются хуже чудовищ, он пытается найти своё место, сражаясь с опасными существами и выполняя заказы за деньги.',
    director: 'Лаурен Шмидт Хиссрих',
    genres: ['Фэнтези', 'Драма', 'Экшн', 'Приключения'],
    actors: ['Генри Кавилл', 'Аня Чалотра', 'Фрейя Аллан', 'Джои Бэти', 'Мимиди Ндивени', 'Майкл Бирн', 'Анна Шаффер', 'Ройс Пирресон'],
    ageRating: 18,
    releaseYear: 2019,
    runtime: '60 мин',
    budget: 70000000,
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
    trailer: 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
    movie: 'https://www.youtube.com/watch?v=ndl1W4ltcmg',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2019,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Начало конца',
            description: 'Геральт встречает Цири в лесу, а Йеннифер начинает свой путь к могуществу.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          },
          {
            episodeNumber: 2,
            title: 'Четыре знака',
            description: 'Геральт выполняет задание в Блавикене, где встречает Йеннифер. Цири бежит из Цинтры.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          },
          {
            episodeNumber: 3,
            title: 'Предательская луна',
            description: 'Геральт и Йеннифер отправляются на поиски джинна. Цири находит убежище.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Сезон 2',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Семя правды',
            description: 'Геральт и Цири прибывают в Каэр Морхен, где начинается обучение Цири.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          },
          {
            episodeNumber: 2,
            title: 'Каэр Морхен',
            description: 'Цири продолжает обучение, а Геральт расследует загадочные события.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          },
          {
            episodeNumber: 3,
            title: 'Что потеряно',
            description: 'Геральт отправляется на поиски Йеннифер, а Цири сталкивается с новыми опасностями.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=ndl1W4ltcmg'
          }
        ]
      }
    ],
    episodes: []
  },
  
  
];

// Функция для добавления всех фильмов
export const addMoviesToFirebase = async () => {
  try {
    // Проверяем авторизацию
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Для добавления фильмов необходимо войти в систему');
    }

    console.log(`Начинаю добавление ${newMovies.length} фильмов в Firebase...`);
    console.log('Пользователь:', user.email);
    
    const results = [];
    
    for (const movie of newMovies) {
      try {
        const movieId = await moviesService.add(movie);
        console.log(`вњ“ Фильм "${movie.title}" добавлен с ID: ${movieId}`);
        results.push({ success: true, title: movie.title, id: movieId });
      } catch (error) {
        console.error(`вњ— Ошибка при добавлении фильма "${movie.title}":`, error);
        results.push({ success: false, title: movie.title, error: error.message });
      }
    }
    
    console.log('\n=== Результаты ===');
    results.forEach(result => {
      if (result.success) {
        console.log(`вњ“ ${result.title} - успешно добавлен (ID: ${result.id})`);
      } else {
        console.log(`вњ— ${result.title} - ошибка: ${result.error}`);
      }
    });
    
    return results;
  } catch (error) {
    console.error('Критическая ошибка при добавлении фильмов:', error);
    throw error;
  }
};

// Если скрипт запускается напрямую (не импортируется)
if (typeof window !== 'undefined') {
  // В браузере можно вызвать через консоль
  window.addMoviesToFirebase = addMoviesToFirebase;
  console.log('Функция addMoviesToFirebase() доступна в консоли. Вызовите её для добавления фильмов.');
}

