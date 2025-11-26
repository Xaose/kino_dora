# Правила безопасности Firestore

## Важно!
Эти правила нужно скопировать и вставить в Firebase Console → Firestore Database → Rules

## Полные правила с поддержкой истории просмотра

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение всем
    match /{document=**} {
      allow read: if true;
    }
    
    // Правила для коллекции movies
    match /movies/{movieId} {
      allow write: if request.auth != null;
    }
    
    // Правила для коллекции doramas
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
    
    // Правила для коллекции favorites
    match /favorites/{favoriteId} {
      // Чтение: только владелец может читать свои избранные
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Создание: только авторизованные пользователи могут создавать свои избранные
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Удаление: только владелец может удалять
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Правила для коллекции comments
    match /comments/{commentId} {
      // Чтение: все могут читать комментарии
      allow read: if true;
      
      // Создание: только авторизованные пользователи могут создавать комментарии
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Обновление: только автор комментария может обновлять
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Удаление: только автор комментария может удалять
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Правила для коллекции watchHistory (история просмотра)
    match /watchHistory/{historyId} {
      // Чтение: только владелец может читать свою историю
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Создание: только авторизованные пользователи могут создавать записи в своей истории
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      
      // Обновление: только владелец может обновлять свою историю
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Удаление: только владелец может удалять из своей истории
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Как применить правила

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Firestore Database** → **Rules**
4. Скопируйте правила выше и вставьте в редактор
5. Нажмите **Publish** для сохранения

## Важно!

После изменения правил подождите 1-2 минуты, пока они применятся. Затем перезагрузите страницу приложения и попробуйте снова сохранить прогресс просмотра.

## Проверка правил

После применения правил вы должны увидеть в консоли:
- ✅ `Прогресс успешно сохранен` вместо ошибки permissions

