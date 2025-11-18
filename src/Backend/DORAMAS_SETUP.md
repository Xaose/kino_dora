# Настройка коллекции дорам в Firebase

## 1. Обновление правил Firestore

Для работы с дорамами необходимо обновить правила безопасности Firestore.

В Firebase Console перейдите в **Firestore Database** в†’ **Rules** и добавьте правила для коллекции `doramas`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение всем
    match /{document=**} {
      allow read: if true;
    }
    
    // Разрешить запись только авторизованным пользователям
    match /movies/{movieId} {
      allow write: if request.auth != null;
    }
    
    // Правила для коллекции дорам
    match /doramas/{doramaId} {
      allow write: if request.auth != null;
    }
    
    // Правила для коллекции users
    match /users/{userId} {
      // Чтение: все могут читать
      allow read: if true;
      
      // Создание: только авторизованные пользователи могут создавать свой профиль
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Обновление: только владелец профиля может обновлять
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Удаление: только владелец профиля может удалять
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**После изменения правил нажмите "Publish" для сохранения!**

## 2. Структура данных дорамы

Дорама содержит все поля фильма плюс дополнительные поля для сезонов и эпизодов:

```javascript
{
  // Основные поля (как у фильма)
  name: "Название дорамы",
  description: "Описание",
  director: "Режиссер",
  genre: ["Драма", "Романтика"],
  age: 12,
  release_year: 2021,
  time: "60 мин",
  budget: 20000000,
  poster: "https://...",
  trailer: "https://...",
  movie: "https://...",
  actors: ["Актер 1", "Актер 2"],
  
  // Дополнительные поля для дорам
  seasons: [
    {
      seasonNumber: 1,
      title: "Сезон 1",
      releaseYear: 2021,
      episodes: [
        {
          episodeNumber: 1,
          title: "Название эпизода",
          description: "Описание эпизода",
          runtime: "60 мин",
          videoUrl: "https://..."
        }
      ]
    }
  ],
  episodes: [] // Общие эпизоды (если не привязаны к сезонам)
}
```

## 3. Добавление дорам в Firebase

### Способ 1: Через консоль браузера

1. Войдите в систему
2. Откройте консоль браузера (F12)
3. Выполните команду:
   ```javascript
   await addDoramasToFirebase()
   ```

### Способ 2: Программно

```javascript
import { doramasService } from './Backend/database';

const newDorama = {
  title: 'Название дорамы',
  description: 'Описание',
  director: 'Режиссер',
  genres: ['Драма', 'Романтика'],
  actors: ['Актер 1', 'Актер 2'],
  ageRating: 12,
  releaseYear: 2021,
  runtime: '60 мин',
  budget: 20000000,
  posterUrl: 'https://...',
  trailerUrl: 'https://...',
  videoUrl: 'https://...',
  seasons: [
    {
      seasonNumber: 1,
      title: 'Сезон 1',
      releaseYear: 2021,
      episodes: [
        {
          episodeNumber: 1,
          title: 'Эпизод 1',
          description: 'Описание',
          runtime: '60 мин',
          videoUrl: 'https://...'
        }
      ]
    }
  ],
  episodes: []
};

const result = await doramasService.add(newDorama);
```

## 4. Работа с дорамами

### Получить все дорамы

```javascript
import { doramasService } from './Backend/database';

const allDoramas = await doramasService.getAll();
```

### Получить дораму по ID

```javascript
const dorama = await doramasService.getById('dorama_id');
```

### Получить дорамы по жанру

```javascript
const dramaDoramas = await doramasService.getByGenre('Драма');
```

### Обновить дораму

```javascript
await doramasService.update('dorama_id', {
  title: 'Новое название',
  // ... другие поля
});
```

### Удалить дораму

```javascript
await doramasService.delete('dorama_id');
```

## 5. Важные замечания

- Коллекция `doramas` создается автоматически при первом добавлении документа
- Все операции записи требуют авторизации пользователя
- Чтение доступно всем пользователям
- Сезоны и эпизоды хранятся как массивы объектов внутри документа дорамы

