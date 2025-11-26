import { doramasService } from './database';
import { getCurrentUser } from './authService';

// Массив дорам с заполненными полями (включая сезоны и серии)
const newDoramas = [
  {
    title: 'Алиса в пограничье',
    description: 'Японский научно-фантастический триллер о Рёхэе Арису и его друзьях, которые оказываются в опустевшем Токио и вынуждены участвовать в опасных играх на выживание.',
    director: 'Синсукэ Сато',
    genres: ['Фантастика', 'Триллер', 'Экшн'],
    actors: ['Кэнто Ямадзаки', 'Тао Цутия', 'Нидзиро Мураками', 'Ая Асахина'],
    ageRating: 18,
    releaseYear: 2020,
    runtime: '50 мин',
    budget: 25000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=49_44FFKZ1M',
    movie: 'https://www.youtube.com/watch?v=49_44FFKZ1M',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2020,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Три карты',
            description: 'Арису и его друзья попадают в пустой Токио и должны играть в смертельные игры.',
            runtime: '50 мин',
            videoUrl: 'https://www.youtube.com/watch?v=49_44FFKZ1M'
          },
          {
            episodeNumber: 2,
            title: 'Игра на выживание',
            description: 'Герои понимают, что игры смертельны, и должны найти способ выжить.',
            runtime: '50 мин',
            videoUrl: 'https://www.youtube.com/watch?v=49_44FFKZ1M'
          },
          {
            episodeNumber: 3,
            title: 'Остров выживания',
            description: 'Арису встречает других игроков и узнает больше о правилах игр.',
            runtime: '50 мин',
            videoUrl: 'https://www.youtube.com/watch?v=49_44FFKZ1M'
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Сезон 2',
        releaseYear: 2022,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Король пик',
            description: 'Арису и его команда сталкиваются с новыми, еще более опасными играми.',
            runtime: '50 мин',
            videoUrl: 'https://www.youtube.com/watch?v=49_44FFKZ1M'
          },
          {
            episodeNumber: 2,
            title: 'Игра с королем',
            description: 'Герои должны победить в игре с королем, чтобы выжить.',
            runtime: '50 мин',
            videoUrl: 'https://www.youtube.com/watch?v=49_44FFKZ1M'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Пентхаус',
    description: 'Южнокорейская дорама о жизни элиты, проживающей в роскошном жилом комплексе "Гера Палас". Сюжет фокусируется на борьбе за власть, богатство и статус среди жителей комплекса.',
    director: 'Чу Дон Мин',
    genres: ['Драма', 'Триллер', 'Криминал'],
    actors: ['Ли Джи А', 'Ким Со Ён', 'Юджин', 'Пак Ын Сок', 'Юн Джон Хи'],
    ageRating: 16,
    releaseYear: 2020,
    runtime: '70 мин',
    budget: 35000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=KqJqFjqJqFj',
    movie: 'https://www.youtube.com/watch?v=KqJqFjqJqFj',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2020,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Роскошь и предательство',
            description: 'Жители "Гера Палас" начинают борьбу за власть и статус.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=KqJqFjqJqFj'
          },
          {
            episodeNumber: 2,
            title: 'Тайны пентхауса',
            description: 'Раскрываются первые тайны жителей роскошного комплекса.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=KqJqFjqJqFj'
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
            title: 'Возвращение',
            description: 'Герои возвращаются в "Гера Палас" с новыми планами.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=KqJqFjqJqFj'
          },
          {
            episodeNumber: 2,
            title: 'Месть',
            description: 'Начинается новая волна интриг и мести.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=KqJqFjqJqFj'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Побег семерых',
    description: 'Южнокорейская дорама о семи людях, связанных с исчезновением девушки. Сюжет раскрывает их тайны и мотивы, приводящие к неожиданным последствиям.',
    director: 'Ом Ки Джун',
    genres: ['Триллер', 'Драма', 'Криминал'],
    actors: ['Ум Ки Джун', 'Хван Джон Ым', 'Ли Джун', 'Чон Ын Джи', 'Ли Ю Би'],
    ageRating: 16,
    releaseYear: 2023,
    runtime: '60 мин',
    budget: 28000000,
    poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500',
    trailer: 'https://www.youtube.com/watch?v=escape7',
    movie: 'https://www.youtube.com/watch?v=escape7',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2023,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Исчезновение',
            description: 'Таинственное исчезновение девушки связывает семерых людей.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=escape7'
          },
          {
            episodeNumber: 2,
            title: 'Тайны',
            description: 'Раскрываются первые тайны семерых главных героев.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=escape7'
          },
          {
            episodeNumber: 3,
            title: 'Побег',
            description: 'Герои пытаются скрыться от правосудия и последствий своих действий.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=escape7'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Мышь',
    description: 'Южнокорейский триллер о детективе Ко Му Чхи и его юном коллеге Чон Ба Рыме, охотящихся на серийного убийцу. Сюжет исследует природу зла и генетику преступности.',
    director: 'Чхве Чин Бом',
    genres: ['Триллер', 'Криминал', 'Драма'],
    actors: ['Ли Сын Ги', 'Ли Хи Джун', 'Пак Чжу Хён', 'Кён Су Джин'],
    ageRating: 18,
    releaseYear: 2021,
    runtime: '70 мин',
    budget: 30000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=mouse2021',
    movie: 'https://www.youtube.com/watch?v=mouse2021',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Охотник',
            description: 'Детектив Ко Му Чхи начинает охоту на серийного убийцу.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=mouse2021'
          },
          {
            episodeNumber: 2,
            title: 'Генетика зла',
            description: 'Раскрывается связь между генетикой и преступным поведением.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=mouse2021'
          },
          {
            episodeNumber: 3,
            title: 'Игра в кошки-мышки',
            description: 'Детективы приближаются к разгадке, но убийца всегда на шаг впереди.',
            runtime: '70 мин',
            videoUrl: 'https://www.youtube.com/watch?v=mouse2021'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Слепцы',
    description: 'Южнокорейская дорама о детективе, судье и студенте юридического факультета, вовлечённых в серию убийств. Сюжет фокусируется на их попытках раскрыть правду и поймать преступника.',
    director: 'Син Ён Сок',
    genres: ['Триллер', 'Драма', 'Криминал'],
    actors: ['Ок Тэк Ён', 'Ха Сок Джин', 'Чон Ын Джи', 'Ким Дон Ук'],
    ageRating: 16,
    releaseYear: 2022,
    runtime: '60 мин',
    budget: 25000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=blind2022',
    movie: 'https://www.youtube.com/watch?v=blind2022',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Сезон 1',
        releaseYear: 2022,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Первое убийство',
            description: 'Детектив, судья и студент сталкиваются с серией загадочных убийств.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=blind2022'
          },
          {
            episodeNumber: 2,
            title: 'Следы',
            description: 'Герои начинают расследование и находят первые зацепки.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=blind2022'
          },
          {
            episodeNumber: 3,
            title: 'Правда',
            description: 'Раскрывается связь между убийствами и прошлым героев.',
            runtime: '60 мин',
            videoUrl: 'https://www.youtube.com/watch?v=blind2022'
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

