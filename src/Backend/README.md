# Firebase Backend Setup

Этот раздел содержит настройку и подключение к Firebase для работы с базой данных.

## Настройка Firebase

### 1. Создайте проект в Firebase Console

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Add project" (Добавить проект)
3. Введите название проекта (например, "kino-dora")
4. Следуйте инструкциям для создания проекта

### 2. Включите Firestore Database

1. В Firebase Console выберите ваш проект
2. Перейдите в раздел **Firestore Database**
3. Нажмите **Create database**
4. Выберите режим:
   - **Production mode** (рекомендуется для продакшена)
   - **Test mode** (для разработки, но менее безопасно)
5. Выберите регион для базы данных (например, `europe-west`)

### 3. Получите конфигурационные данные

1. В Firebase Console перейдите в **Project Settings** (вљ™пёЏ)
2. Прокрутите вниз до раздела **Your apps**
3. Нажмите на иконку веб-приложения (`</>`) или **Add app** > **Web**
4. Зарегистрируйте приложение (можно использовать любое имя)
5. Скопируйте конфигурационный объект `firebaseConfig`

### 4. Создайте файл .env

В корне проекта создайте файл `.env` со следующим содержимым:

```env
REACT_APP_FIREBASE_API_KEY=ваш_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=ваш_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ваш_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=ваш_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
REACT_APP_FIREBASE_APP_ID=ваш_app_id
```

**ВАЖНО:** Замените все значения на реальные данные из Firebase Console!

### 5. Настройте правила безопасности Firestore

В Firebase Console перейдите в **Firestore Database** > **Rules** и настройте правила доступа. Для начала можно использовать:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение всем, запись только аутентифицированным пользователям
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Внимание:** Эти правила открывают чтение для всех. Для продакшена настройте более строгие правила!

## Использование

### Импорт в компонентах

```javascript
import { db } from '../Backend/firebaseConfig';
import { moviesService } from '../Backend/database';

// Получить все фильмы
const movies = await moviesService.getAll();

// Получить фильм по ID
const movie = await moviesService.getById('movie_id');

// Добавить новый фильм
const newMovieId = await moviesService.add({
  title: 'Название фильма',
  genre: 'Драма',
  year: 2024
});
```

### Пример использования в компоненте React

```javascript
import { useState, useEffect } from 'react';
import { moviesService } from '../Backend/database';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesService.getAll();
        setMovies(data);
      } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## Доступные сервисы

- `moviesService` - работа с фильмами
- `seriesService` - работа с сериалами
- `usersService` - работа с пользователями

Каждый сервис имеет методы:
- `getAll()` - получить все документы
- `getById(id)` - получить документ по ID
- `add(data)` - добавить новый документ
- `update(id, data)` - обновить документ
- `delete(id)` - удалить документ

## Дополнительные функции

В файле `database.js` также доступны базовые функции:
- `getAllDocuments(collectionName)`
- `getDocumentById(collectionName, documentId)`
- `addDocument(collectionName, data)`
- `updateDocument(collectionName, documentId, data)`
- `deleteDocument(collectionName, documentId)`
- `getDocumentsWithFilter(collectionName, field, value)`
- `getDocumentsOrdered(collectionName, field, direction, limit)`

