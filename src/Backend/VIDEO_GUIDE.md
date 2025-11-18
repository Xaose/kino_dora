# Руководство по работе с видео

## Быстрый старт

### 1. Загрузка видео через Firebase Console

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект в†’ **Storage**
3. Создайте структуру папок:
   ```
   movies/
     в””в”Ђв”Ђ movie_123/
         в”њв”Ђв”Ђ video.mp4
         в””в”Ђв”Ђ poster.jpg
   ```
4. Загрузите файлы
5. Скопируйте URL видео (правый клик в†’ "Get download URL")
6. Обновите поле `videoUrl` в Firestore для вашего фильма

### 2. Использование компонента VideoUploader (для админки)

```jsx
import VideoUploader from '../Components/VideoUploader/VideoUploader';
import { moviesService } from '../Backend/database';

function AdminPanel() {
  const [movieId, setMovieId] = useState('');

  const handleVideoUploaded = async (videoUrl) => {
    // Обновить videoUrl в базе данных
    await moviesService.update(movieId, { videoUrl });
    console.log('Видео URL сохранен:', videoUrl);
  };

  return (
    <VideoUploader
      movieId={movieId}
      onVideoUploaded={handleVideoUploaded}
      onPosterUploaded={(url) => console.log('Poster:', url)}
    />
  );
}
```

### 3. Форматы и рекомендации

**Поддерживаемые форматы видео:**
- MP4 (H.264) - **рекомендуется**
- WebM (VP9)
- MP4 (H.265/HEVC)

**Рекомендуемые настройки:**
- Разрешение: 1080p или 720p
- Битрейт: 5-8 Mbps (1080p), 3-5 Mbps (720p)
- Аудио: AAC, 128-192 kbps

**Конвертация через FFmpeg:**
```bash
ffmpeg -i input.mkv \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -c:a aac \
  -b:a 192k \
  output.mp4
```

## Преимущества Firebase Storage

вњ… **Полный контроль** - ваш кастомный плеер работает полностью  
вњ… **Высокое качество** - без ограничений YouTube  
вњ… **Быстрая загрузка** - CDN Google по всему миру  
вњ… **Без рекламы** - никаких сторонних элементов  
вњ… **Адаптивность** - работает на всех устройствах  

## Стоимость

Firebase Storage имеет бесплатный тариф:
- 5 GB хранилища
- 1 GB/день трафика

После этого:
- $0.026/GB хранилища
- $0.12/GB трафика

Для фильма 2GB при 1000 просмотров в день ≈ $0.24/день

## Альтернативы (если Firebase дорого)

1. **Cloudflare Stream** - $1/1000 минут просмотра
2. **AWS S3 + CloudFront** - дешевле для больших объемов
3. **Vimeo API** - готовый видеохостинг
4. **Mux** - профессиональный сервис

## Обновление существующих фильмов

Если у вас Сѓже есть YouTube ссылки, можно:

1. **Оставить как есть** - YouTube будет работать через iframe
2. **Мигрировать** - загрузить видео в Firebase Storage и обновить `videoUrl`

Пример миграции:
```javascript
// Старый формат (YouTube)
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"

// Новый формат (Firebase Storage)
videoUrl: "https://firebasestorage.googleapis.com/..."
```

Плеер автоматически определит тип URL и использует правильный метод воспроизведения.

