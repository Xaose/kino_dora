import { doramasService } from './database';
import { getCurrentUser } from './authService';

// Массив дорам с заполненными полями (включая сезоны и серии)
const newDoramas = [
  {
    title: 'Игра в кальмара',
    description: 'Сотни игроков с низким доходом получают приглашение принять участие в детских играх с заманчивым призом в 45,6 миллиарда вон. Они рискуют жизнью, чтобы стать единственным победителем.',
    director: 'Хван Дон Хёк',
    genres: ['Триллер', 'Драма', 'Экшн'],
    actors: ['Ли Чон Джэ', 'Пак Хэ Су', 'О Ён Су', 'Хо Сон Тхэ'],
    ageRating: 18,
    releaseYear: 2021,
    runtime: '60 мин',
    budget: 21400000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    movie: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Красный свет, зеленый свет',
            description: 'Сон Ги Хун получает загадочное приглашение принять участие в игре.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4'
          },
          {
            episodeNumber: 2,
            title: 'Ад',
            description: 'Игроки понимают, что проигрыш означает смерть.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4'
          }
        ]
      }
    ],
    episodes: [] // Общие эпизоды (если не привязаны к сезонам)
  },
  {
    title: 'Паразиты',
    description: 'История о семье Ки Тхэка, которая постепенно проникает в дом богатой семьи Пак, используя хитрость и обман.',
    director: 'Пон Чжун Хо',
    genres: ['Триллер', 'Драма', 'Комедия'],
    actors: ['Сон Кан Хо', 'Ли Сон Гюн', 'Чо Ё Чон', 'Чхве У Сик'],
    ageRating: 16,
    releaseYear: 2019,
    runtime: '132 мин',
    budget: 11000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    movie: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    seasons: [],
    episodes: [
      {
        episodeNumber: 1,
        title: 'Эпизод 1',
        description: 'Семья Ки Тхэка начинает свой план.',
        runtime: '132 мин',
        videoUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY'
      }
    ]
  },
  {
    title: 'Король: Вечный монарх',
    description: 'Корейский император пытается закрыть портал между двумя мирами и встречает детектива из современной Кореи.',
    director: 'Бэк Сан Хун',
    genres: ['Фантастика', 'Романтика', 'Драма'],
    actors: ['Ли Мин Хо', 'Ким Го Ын', 'У До Хван', 'Чон Ын Чэ'],
    ageRating: 12,
    releaseYear: 2020,
    runtime: '70 мин',
    budget: 30000000,
    poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500',
    trailer: 'https://www.youtube.com/watch?v=G5tzsfN5nwM',
    movie: 'https://www.youtube.com/watch?v=G5tzsfN5nwM',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2020,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Король двух миров',
            description: 'Император Ли Гон пересекает портал в современную Корею.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          },
          {
            episodeNumber: 2,
            title: 'Лунная кролица',
            description: 'Детектив Чон Тхэ И встречает загадочного мужчину.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          },
          {
            episodeNumber: 3,
            title: 'Тайна портала',
            description: 'Тайна портала между мирами раскрывается.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Винченцо',
    description: 'Корейско-итальянский мафиози Винченцо Кассано возвращается в Корею и вступает в битву с коррумпированной корпорацией.',
    director: 'Ким Хи Вон',
    genres: ['Комедия', 'Криминал', 'Драма'],
    actors: ['Сон Чжун Ки', 'Чон Ё Бин', 'Ок Тхэ Кю', 'Ким Ё Джин'],
    ageRating: 16,
    releaseYear: 2021,
    runtime: '80 мин',
    budget: 20000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=S12-4mXCNj4',
    movie: 'https://www.youtube.com/watch?v=S12-4mXCNj4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Возвращение мафиози',
            description: 'Винченцо возвращается в Корею.',
            runtime: '80 мин',
            videoUrl: 'https://www.youtube.com/watch?v=S12-4mXCNj4'
          },
          {
            episodeNumber: 2,
            title: 'Битва начинается',
            description: 'Винченцо начинает борьбу с корпорацией.',
            runtime: '80 мин',
            videoUrl: 'https://www.youtube.com/watch?v=S12-4mXCNj4'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Хилер',
    description: 'Репортер и курьер с особыми способностями работают вместе, чтобы раскрыть правду о коррупции.',
    director: 'Сон Чжун Хо',
    genres: ['Экшн', 'Романтика', 'Драма'],
    actors: ['Чи Чан Ук', 'Пак Мин Ён', 'Ю Джи Тхэ', 'Пак Сан Ун'],
    ageRating: 12,
    releaseYear: 2014,
    runtime: '60 мин',
    budget: 15000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=8X5kEnw3zqI',
    movie: 'https://www.youtube.com/watch?v=8X5kEnw3zqI',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2014,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Курьер',
            description: 'Знакомство с главными героями.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=8X5kEnw3zqI'
          },
          {
            episodeNumber: 2,
            title: 'Правда',
            description: 'Начало расследования.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=8X5kEnw3zqI'
          }
        ]
      }
    ],
    episodes: []
  }
];

/**
 * Добавить дорамы в Firebase
 * Требует авторизации пользователя
 */
export const addDoramasToFirebase = async () => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('Ошибка: Пользователь не авторизован');
      return {
        success: false,
        error: 'Требуется авторизация для добавления дорам'
      };
    }

    console.log(`Начинаю добавление ${newDoramas.length} дорам в Firebase...`);
    console.log('Пользователь:', user.email);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const dorama of newDoramas) {
      try {
        const result = await doramasService.add(dorama);
        successCount++;
        results.push({
          success: true,
          title: dorama.title,
          id: result.id
        });
        console.log(`вњ“ Добавлена дорама: "${dorama.title}"`);
      } catch (error) {
        errorCount++;
        results.push({
          success: false,
          title: dorama.title,
          error: error.message
        });
        console.error(`вњ— Ошибка при добавлении "${dorama.title}":`, error);
      }
    }

    console.log(`\n=== Результаты ===`);
    console.log(`вњ“ Успешно добавлено: ${successCount}`);
    console.log(`вњ— Ошибок: ${errorCount}`);

    return {
      success: true,
      added: successCount,
      errors: errorCount,
      results
    };
  } catch (error) {
    console.error('Критическая ошибка при добавлении дорам:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

