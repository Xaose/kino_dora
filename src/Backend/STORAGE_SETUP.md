# Настройка Firebase Storage для видео

## 1. Настройка правил безопасности Storage

Перейдите в Firebase Console в†’ Storage в†’ Rules и установите следующие правила:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Разрешить чтение всем
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Разрешить запись только аутентифицированным пользователям
    // Для разработки можно временно разрешить всем:
    // allow write: if true;
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    // Или более строгие правила для продакшена:
    // match /movies/{movieId}/{fileName} {
    //   allow read: if true;
    //   allow write: if request.auth != null && request.auth.token.admin == true;
    // }
  }
}
```

## 2. Настройка CORS (если нужно)

Если планируете использовать прямые ссылки на видео, настройте CORS для Storage:

1. Создайте файл `cors.json`:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

2. Установите gcloud CLI и выполните:
```bash
gsutil cors set cors.json gs://your-storage-bucket
```

## 3. Загрузка видео через консоль

### Вариант 1: Через Firebase Console
1. Откройте Firebase Console в†’ Storage
2. Создайте папку `movies`
3. Внутри создайте папку с ID фильма (например, `movie_123`)
4. Загрузите видео файл (рекомендуемые форматы: MP4, WebM)
5. Скопируйте URL файла

### Вариант 2: Через код (для админки)

```javascript
import { uploadMovieVideo } from '../Backend/storageService';

const handleVideoUpload = async (file, movieId) => {
  try {
    const url = await uploadMovieVideo(file, movieId, (progress) => {
      console.log(`Прогресс: ${progress}%`);
    });
    console.log('Видео загружено:', url);
    return url;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
```

## 4. Обновление данных фильма

После загрузки видео обновите поле `videoUrl` в Firestore:

```javascript
import { moviesService } from '../Backend/database';

// Обновить videoUrl фильма
await moviesService.update(movieId, {
  videoUrl: 'https://firebasestorage.googleapis.com/...'
});
```

## 5. Рекомендации по форматам и качеству

### Поддерживаемые форматы:
- **MP4 (H.264)** - лучшая совместимость
- **WebM (VP9)** - лучшее сжатие
- **MP4 (H.265/HEVC)** - лучшее качество при меньшем размере

### Рекомендуемые настройки:
- **Разрешение**: 1080p (1920x1080) или 720p (1280x720)
- **Битрейт**: 5-8 Mbps для 1080p, 3-5 Mbps для 720p
- **Аудио**: AAC, 128-192 kbps
- **Контейнер**: MP4

### Инструменты для конвертации:
- **FFmpeg** (командная строка)
- **HandBrake** (GUI)
- **CloudConvert** (онлайн)

Пример FFmpeg команды:
```bash
ffmpeg -i input.mkv -c:v libx264 -preset slow -crf 22 -c:a aac -b:a 192k output.mp4
```

## 6. Оптимизация размера файлов

### Сжатие видео:
- Используйте H.264 с CRF 20-23 для баланса качества/размера
- Для длинных фильмов рассмотрите адаптивный стриминг (HLS/DASH)
- Используйте предпросмотр (thumbnail) для быстрой загрузки

### CDN и кэширование:
Firebase Storage автоматически использует CDN Google, но можно дополнительно:
- Настроить кэширование через HTTP заголовки
- Использовать Cloud CDN для еще большей скорости

## 7. Мониторинг использования

В Firebase Console в†’ Storage можно отслеживать:
- Объем хранилища
- Количество запросов
- Стоимость использования

## 8. Альтернативные решения

Если Firebase Storage становится дорогим, рассмотрите:
- **Cloudflare Stream** - специализированный видеохостинг
- **AWS S3 + CloudFront** - более дешевое хранилище
- **Vimeo API** - готовый видеохостинг с API
- **Mux** - профессиональный видеосервис

