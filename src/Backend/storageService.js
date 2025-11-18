import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { storage } from './firebaseConfig';

/**
 * Сервис для работы с Firebase Storage
 * Предназначен для загрузки и управления видео файлами
 */

/**
 * Загрузить видео файл в Firebase Storage
 * @param {File} file - Файл видео для загрузки
 * @param {string} path - Путь в Storage (например, 'movies/video_id.mp4')
 * @param {Function} onProgress - Callback для отслеживания прогресса (progress: number) => void
 * @returns {Promise<string>} - URL загруженного видео
 */
export const uploadVideo = async (file, path, onProgress = null) => {
  try {
    // Проверка типа файла
    if (!file.type.startsWith('video/')) {
      throw new Error('Файл должен быть видео');
    }

    // Создаем ссылку на файл в Storage
    const storageRef = ref(storage, path);
    
    // Создаем задачу загрузки с возможностью отслеживания прогресса
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Возвращаем Promise, который разрешится после загрузки
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Отслеживание прогресса
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Обработка ошибок
          console.error('Ошибка загрузки видео:', error);
          reject(error);
        },
        async () => {
          // Загрузка завершена, получаем URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Ошибка при загрузке видео:', error);
    throw error;
  }
};

/**
 * Получить URL видео из Firebase Storage
 * @param {string} path - Путь к файлу в Storage
 * @returns {Promise<string>} - URL видео
 */
export const getVideoUrl = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Ошибка при получении URL видео:', error);
    throw error;
  }
};

/**
 * Удалить видео из Firebase Storage
 * @param {string} path - Путь к файлу в Storage
 * @returns {Promise<void>}
 */
export const deleteVideo = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Ошибка при удалении видео:', error);
    throw error;
  }
};

/**
 * Получить метаданные видео
 * @param {string} path - Путь к файлу в Storage
 * @returns {Promise<Object>} - Метаданные файла
 */
export const getVideoMetadata = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return metadata;
  } catch (error) {
    console.error('Ошибка при получении метаданных:', error);
    throw error;
  }
};

/**
 * Проверить, является ли URL ссылкой на Firebase Storage
 * @param {string} url - URL для проверки
 * @returns {boolean}
 */
export const isFirebaseStorageUrl = (url) => {
  if (!url) return false;
  return url.includes('firebasestorage.googleapis.com') || 
         url.includes('firebasestorage.app');
};

/**
 * Извлечь путь из Firebase Storage URL
 * @param {string} url - Firebase Storage URL
 * @returns {string|null} - Путь к файлу или null
 */
export const extractPathFromUrl = (url) => {
  if (!isFirebaseStorageUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    // Путь обычно находится после /o/ в URL
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
  } catch (error) {
    console.error('Ошибка при извлечении пути:', error);
  }
  
  return null;
};

/**
 * Загрузить видео для фильма
 * @param {File} file - Файл видео
 * @param {string} movieId - ID фильма
 * @param {Function} onProgress - Callback для прогресса
 * @returns {Promise<string>} - URL загруженного видео
 */
export const uploadMovieVideo = async (file, movieId, onProgress = null) => {
  const fileExtension = file.name.split('.').pop();
  const path = `movies/${movieId}/video.${fileExtension}`;
  return uploadVideo(file, path, onProgress);
};

/**
 * Загрузить постер для фильма
 * @param {File} file - Файл изображения
 * @param {string} movieId - ID фильма
 * @param {Function} onProgress - Callback для прогресса
 * @returns {Promise<string>} - URL загруженного постера
 */
export const uploadMoviePoster = async (file, movieId, onProgress = null) => {
  const fileExtension = file.name.split('.').pop();
  const path = `movies/${movieId}/poster.${fileExtension}`;
  
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Ошибка загрузки постера:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Ошибка при загрузке постера:', error);
    throw error;
  }
};

/**
 * Загрузить аватар пользователя
 * @param {File} file - Файл изображения
 * @param {string} userId - ID пользователя
 * @param {Function} onProgress - Callback для прогресса
 * @returns {Promise<string>} - URL загруженного аватара
 */
export const uploadUserAvatar = async (file, userId, onProgress = null) => {
  // Проверка типа файла
  if (!file.type.startsWith('image/')) {
    throw new Error('Файл должен быть изображением');
  }

  const fileExtension = file.name.split('.').pop();
  const path = `users/${userId}/avatar.${fileExtension}`;
  
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Ошибка загрузки аватара:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    throw error;
  }
};

export default {
  uploadVideo,
  getVideoUrl,
  deleteVideo,
  getVideoMetadata,
  isFirebaseStorageUrl,
  extractPathFromUrl,
  uploadMovieVideo,
  uploadMoviePoster,
  uploadUserAvatar
};

