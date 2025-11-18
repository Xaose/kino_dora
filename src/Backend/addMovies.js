import { moviesService } from './database';
import { getCurrentUser } from './authService';

// Массив фильмов с заполненными полями
const newMovies = [
  {
    title: 'Интерстеллар',
    description: 'Фильм о команде исследователей, которые используют недавно обнаруженный червоточину, чтобы обойти ограничения космических путешествий человека и преодолеть огромные расстояния для межзвездного путешествия.',
    director: 'Кристофер Нолан',
    genres: ['Фантастика', 'Драма', 'Приключения'],
    actors: ['Мэттью Макконахи', 'Энн Хэтэуэй', 'Джессика Честейн', 'Майкл Кейн'],
    ageRating: 12,
    releaseYear: 2014,
    runtime: '169 мин',
    budget: 165000000,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    movie: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  },
  {
    title: 'Начало',
    description: 'Дом Кобб — искусный вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.',
    director: 'Кристофер Нолан',
    genres: ['Фантастика', 'Триллер', 'Экшн'],
    actors: ['Леонардо ДиКаприо', 'Марион Котийяр', 'Том Харди', 'Эллен Пейдж'],
    ageRating: 12,
    releaseYear: 2010,
    runtime: '148 мин',
    budget: 160000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    movie: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
  },
  {
    title: 'Матрица',
    description: 'Компьютерный хакер узнает от таинственных повстанцев о истинной природе его реальности и своей роли в войне против ее контролеров.',
    director: 'Лана Вачовски',
    genres: ['Фантастика', 'Экшн'],
    actors: ['Киану Ривз', 'Лоуренс Фишберн', 'Кэрри-Энн Мосс', 'Хьюго Уивинг'],
    ageRating: 16,
    releaseYear: 1999,
    runtime: '136 мин',
    budget: 63000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    movie: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  },
  {
    title: 'Побег из Шоушенка',
    description: 'Два заключенных заводят дружбСѓ на протяжении многих лет, находя утешение и возможное искупление через акты обычной человеческой порядочности.',
    director: 'Фрэнк Дарабонт',
    genres: ['Драма'],
    actors: ['Тим Роббинс', 'Морган Фриман', 'Боб Гантон', 'Уильям Сэдлер'],
    ageRating: 16,
    releaseYear: 1994,
    runtime: '142 мин',
    budget: 25000000,
    poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    movie: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
  },
  {
    title: 'Форрест Гамп',
    description: 'История жизни Форреста Гампа, добродушного и простодушного человека из Алабамы, который, несмотря на свои умственные ограничения, становится свидетелем и невольно влияет на несколько определяющих исторических событий в 20 веке.',
    director: 'Роберт Земекис',
    genres: ['Драма', 'Комедия', 'Романтика'],
    actors: ['Том Хэнкс', 'Робин Райт', 'Гэри Синиз', 'Салли Филд'],
    ageRating: 12,
    releaseYear: 1994,
    runtime: '142 мин',
    budget: 55000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
    movie: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
  },
  {
    title: 'Иллюзия обмана 2',
    description: 'Четыре всадника возвращаются для нового выступления, но оказываются втянуты в опасную игру с технологическим гением, который требует их помощи для совершения невозможного ограбления.',
    director: 'Джон М. Чу',
    genres: ['Триллер', 'Криминал', 'Экшн'],
    actors: ['Джесси Айзенберг', 'Марк Руффало', 'Вуди Харрельсон', 'Лиззи Каплан', 'Дэйв Франко', 'Дэниел Рэдклифф'],
    ageRating: 12,
    releaseYear: 2016,
    runtime: '129 мин',
    budget: 90000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=4I3rY95b1yI',
    movie: 'https://www.youtube.com/watch?v=4I3rY95b1yI',
  },
  {
    title: 'Иллюзия обмана 3',
    description: 'В финальной части трилогии Четыре всадника сталкиваются с самым опасным противником - таинственной организацией, которая использует магию для контроля над миром. Им предстоит разгадать последнюю иллюзию.',
    director: 'Рубен Флейшер',
    genres: ['Триллер', 'Криминал', 'Экшн', 'Мистика'],
    actors: ['Джесси Айзенберг', 'Марк Руффало', 'Вуди Харрельсон', 'Лиззи Каплан', 'Дэйв Франко'],
    ageRating: 12,
    releaseYear: 2024,
    runtime: '135 мин',
    budget: 100000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=4OtM9j2lcUA',
    movie: 'https://www.youtube.com/watch?v=4OtM9j2lcUA',
  },
  {
    title: 'Темный рыцарь',
    description: 'Бэтмен принимает одно из величайших психологических и физических испытаний своей способности бороться с несправедливостью, когда в Готэм-Сити появляется злодей, известный как Джокер.',
    director: 'Кристофер Нолан',
    genres: ['Экшн', 'Криминал', 'Драма', 'Триллер'],
    actors: ['Кристиан Бейл', 'Хит Леджер', 'Аарон Экхарт', 'Мэгги Джилленхол', 'Гэри Олдман'],
    ageRating: 16,
    releaseYear: 2008,
    runtime: '152 мин',
    budget: 185000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    movie: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  },
  {
    title: 'Криминальное чтиво',
    description: 'Истории двух бандитов, боксера, гангстера и его жены, а также пары грабителей ресторана переплетаются в четырех историях насилия и искупления.',
    director: 'Квентин Тарантино',
    genres: ['Криминал', 'Драма', 'Триллер'],
    actors: ['Джон Траволта', 'Сэмюэл Л. Джексон', 'Ума Турман', 'Брюс Уиллис', 'Харви Кейтель'],
    ageRating: 18,
    releaseYear: 1994,
    runtime: '154 мин',
    budget: 8000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    movie: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
  },
  {
    title: 'Бойцовский клуб',
    description: 'Недовольный своей жизнью офисный работник встречает загадочного торговца мылом и вместе они создают подпольный бойцовский клуб, который превращается в нечто гораздо большее.',
    director: 'Дэвид Финчер',
    genres: ['Драма', 'Триллер'],
    actors: ['Брэд Питт', 'Эдвард Нортон', 'Хелена Бонем Картер', 'Мит Лоаф'],
    ageRating: 18,
    releaseYear: 1999,
    runtime: '139 мин',
    budget: 63000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    movie: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
  },
  {
    title: 'Зеленая миля',
    description: 'История о надзирателе тюрьмы, который становится свидетелем сверхъестественных событий после появления в его тюрьме осужденного убийцы, обладающего таинственной силой.',
    director: 'Фрэнк Дарабонт',
    genres: ['Драма', 'Фантастика', 'Криминал'],
    actors: ['Том Хэнкс', 'Майкл Кларк Дункан', 'Дэвид Морс', 'Бонни Хант'],
    ageRating: 16,
    releaseYear: 1999,
    runtime: '189 мин',
    budget: 60000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=Ki4haFrqSrw',
    movie: 'https://www.youtube.com/watch?v=Ki4haFrqSrw',
  },
  {
    title: 'Список Шиндлера',
    description: 'В Польше во время Второй мировой войны Оскар Шиндлер постепенно обеспокоен судьбой своих еврейских рабочих после того, как становится свидетелем их преследования нацистами.',
    director: 'Стивен Спилберг',
    genres: ['Драма', 'Исторический', 'Военный'],
    actors: ['Лиам Нисон', 'Ральф Файнс', 'Бен Кингсли', 'Кэролайн Гудолл'],
    ageRating: 16,
    releaseYear: 1993,
    runtime: '195 мин',
    budget: 22000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=gG22XNhtnoY',
    movie: 'https://www.youtube.com/watch?v=gG22XNhtnoY',
  },
  {
    title: 'Властелин колец: Братство кольца',
    description: 'Молодой хоббит Фродо получает кольцо и должен отправиться в опасное путешествие в Мордор, чтобы уничтожить его, пока темный лорд Саурон не вернет его себе.',
    director: 'Питер Джексон',
    genres: ['Фантастика', 'Приключения', 'Драма'],
    actors: ['Элайджа Вуд', 'Иэн Маккеллен', 'Орландо Блум', 'Вигго Мортенсен', 'Шон Эстин'],
    ageRating: 12,
    releaseYear: 2001,
    runtime: '178 мин',
    budget: 93000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
    movie: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
  },
  {
    title: 'Гладиатор',
    description: 'Когда римский генерал Максимус предан и его семья убита императором-узурпатором, он спускается, чтобы стать рабом и гладиатором и в конечном итоге мстить.',
    director: 'Ридли Скотт',
    genres: ['Драма', 'Экшн', 'Приключения'],
    actors: ['Рассел Кроу', 'Хоакин Феникс', 'Конни Нильсен', 'Оливер Рид'],
    ageRating: 16,
    releaseYear: 2000,
    runtime: '155 мин',
    budget: 103000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=owK1qxDselE',
    movie: 'https://www.youtube.com/watch?v=owK1qxDselE',
  },
  {
    title: 'Титаник',
    description: 'Семнадцатилетняя Роза отправляется в путешествие на роскошном лайнере "Титаник" в 1912 году. Она влюбляется в Джека, бедного художника, но их роман прерывается трагическим крушением корабля.',
    director: 'Джеймс Кэмерон',
    genres: ['Драма', 'Романтика', 'Исторический'],
    actors: ['Леонардо ДиКаприо', 'Кейт Уинслет', 'Билли Зейн', 'Кэти Бейтс'],
    ageRating: 12,
    releaseYear: 1997,
    runtime: '194 мин',
    budget: 200000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=CHekzSiZjrY',
    movie: 'https://www.youtube.com/watch?v=CHekzSiZjrY',
  },
  {
    title: 'Пираты Карибского моря: Проклятие Черной жемчужины',
    description: 'Черныйsmith Уилл Тернер объединяется с эксцентричным пиратом Джеком Воробьем, чтобы спасти свою возлюбленную от пиратов, которые превратились в скелетов под проклятием.',
    director: 'Гор Вербински',
    genres: ['Приключения', 'Фантастика', 'Экшн'],
    actors: ['Джонни Депп', 'Орландо Блум', 'Кира Найтли', 'Джеффри Раш'],
    ageRating: 12,
    releaseYear: 2003,
    runtime: '143 мин',
    budget: 140000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=naQr0uTrH_s',
    movie: 'https://www.youtube.com/watch?v=naQr0uTrH_s',
  },
  {
    title: 'Аватар',
    description: 'Парализованный морской пехотинец отправляется на миссию на далекую планету Пандора, но становится разделенным между выполнением своей миссии и защитой мира, который он считает своим домом.',
    director: 'Джеймс Кэмерон',
    genres: ['Фантастика', 'Экшн', 'Приключения'],
    actors: ['Сэм Уортингтон', 'Зои Салдана', 'Сигурни Уивер', 'Стивен Лэнг'],
    ageRating: 12,
    releaseYear: 2009,
    runtime: '162 мин',
    budget: 237000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
    movie: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
  },
  {
    title: 'Мстители',
    description: 'Группа супергероев объединяется, чтобы остановить Локи и его армию от завоевания Земли. Первая крупная команда супергероев Marvel.',
    director: 'Джосс Уидон',
    genres: ['Фантастика', 'Экшн', 'Приключения'],
    actors: ['Роберт Дауни-младший', 'Крис Эванс', 'Марк Руффало', 'Крис Хемсворт', 'Скарлетт Йоханссон'],
    ageRating: 12,
    releaseYear: 2012,
    runtime: '143 мин',
    budget: 220000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=eOrNdBpGMv8',
    movie: 'https://www.youtube.com/watch?v=eOrNdBpGMv8',
  },
  {
    title: 'Дюна',
    description: 'Пол Атрейдес ведет мятеж, чтобы восстановить будущее своей семьи на планете Арракис, самой опасной планете во вселенной.',
    director: 'Дени Вильнёв',
    genres: ['Фантастика', 'Драма', 'Приключения'],
    actors: ['Тимоти Шаламе', 'Ребекка Фергюсон', 'Оскар Айзек', 'Зендея', 'Джейсон Момоа'],
    ageRating: 12,
    releaseYear: 2021,
    runtime: '155 мин',
    budget: 165000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
    movie: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
  }
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

