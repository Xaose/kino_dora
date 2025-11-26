import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
};

const normalizeMovieDocument = (doc) => ({
  id: doc.id,
  title: doc.name || doc.title || 'Без названия',
  description: doc.description || '',
  director: doc.director || '',
  genres: ensureArray(doc.genre),
  actors: ensureArray(doc.actors),
  ageRating: doc.age ?? null,
  releaseYear: doc.release_year ?? doc.releaseYear ?? null,
  runtime: doc.time || doc.runtime || '',
  budget: doc.budget ?? null,
  posterUrl: doc.poster || doc.posterUrl || '',
  trailerUrl: doc.trailer || doc.trailerUrl || '',
  videoUrl: doc.movie || doc.videoUrl || '',
  contentRating: doc.age || null,
  seasons: doc.seasons || [],
  episodes: doc.episodes || []
});

const serializeMovieData = (data = {}) => ({
  name: data.title ?? data.name ?? '',
  description: data.description ?? '',
  director: data.director ?? '',
  genre: ensureArray(data.genres ?? data.genre ?? []),
  age: data.ageRating ?? data.age ?? null,
  release_year: data.releaseYear ?? data.release_year ?? null,
  time: data.runtime ?? data.time ?? '',
  budget: data.budget ?? null,
  poster: data.posterUrl ?? data.poster ?? '',
  trailer: data.trailerUrl ?? data.trailer ?? '',
  movie: data.videoUrl ?? data.movie ?? '',
  actors: ensureArray(data.actors ?? []),
  seasons: data.seasons || [],
  episodes: data.episodes || []
});

/**
 * Базовые операции с базой данных Firestore
 */

// Получить все документы из коллекции
export const getAllDocuments = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error(`Ошибка при получении документов из ${collectionName}:`, error);
    throw error;
  }
};

// Получить один документ по ID
export const getDocumentById = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error(`Документ с ID ${documentId} не найден`);
    }
  } catch (error) {
    console.error(`Ошибка при получении документа ${documentId}:`, error);
    throw error;
  }
};

// Добавить новый документ
export const addDocument = async (collectionName, data) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error(`Ошибка при добавлении документа в ${collectionName}:`, error);
    throw error;
  }
};

// Обновить документ
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error(`Ошибка при обновлении документа ${documentId}:`, error);
    throw error;
  }
};

// Удалить документ
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error(`Ошибка при удалении документа ${documentId}:`, error);
    throw error;
  }
};

// Получить документы с фильтрацией
export const getDocumentsWithFilter = async (collectionName, filterField, filterValue, comparison = '==') => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(filterField, comparison, filterValue));
    const querySnapshot = await getDocs(q);
    
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error(`Ошибка при фильтрации документов:`, error);
    throw error;
  }
};

// Получить документы с сортировкой
export const getDocumentsOrdered = async (collectionName, orderField, orderDirection = 'asc', limitCount = null) => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef, orderBy(orderField, orderDirection));
    
    if (limitCount) {
      q = query(collectionRef, orderBy(orderField, orderDirection), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error(`Ошибка при получении отсортированных документов:`, error);
    throw error;
  }
};

// Примеры использования для вашего проекта:

// Работа с фильмами
export const moviesService = {
  getAll: async () => {
    const docs = await getAllDocuments('movies');
    return docs.map(normalizeMovieDocument);
  },
  getById: async (id) => {
    const doc = await getDocumentById('movies', id);
    return normalizeMovieDocument(doc);
  },
  add: (movieData) => addDocument('movies', {
    ...serializeMovieData(movieData)
  }),
  update: (id, movieData) =>
    updateDocument('movies', id, serializeMovieData(movieData)),
  delete: (id) => deleteDocument('movies', id),
  getByGenre: async (genre) => {
    const docs = await getDocumentsWithFilter('movies', 'genre', genre, 'array-contains');
    return docs.map(normalizeMovieDocument);
  },
  getLatest: async (count = 10) => {
    const docs = await getDocumentsOrdered('movies', 'createdAt', 'desc', count);
    return docs.map(normalizeMovieDocument);
  }
};

// Нормализация документа дорамы
const normalizeDoramaDocument = (doc) => ({
  id: doc.id,
  title: doc.name || doc.title || 'Без названия',
  description: doc.description || '',
  director: doc.director || '',
  genres: ensureArray(doc.genre),
  actors: ensureArray(doc.actors),
  ageRating: doc.age ?? null,
  releaseYear: doc.release_year ?? doc.releaseYear ?? null,
  runtime: doc.time || doc.runtime || '',
  budget: doc.budget ?? null,
  posterUrl: doc.poster || doc.posterUrl || '',
  trailerUrl: doc.trailer || doc.trailerUrl || '',
  videoUrl: doc.movie || doc.videoUrl || '',
  contentRating: doc.age || null,
  seasons: doc.seasons || [],
  episodes: doc.episodes || []
});

// Сериализация данных дорамы
const serializeDoramaData = (data = {}) => ({
  name: data.title ?? data.name ?? '',
  description: data.description ?? '',
  director: data.director ?? '',
  genre: ensureArray(data.genres ?? data.genre ?? []),
  age: data.ageRating ?? data.age ?? null,
  release_year: data.releaseYear ?? data.release_year ?? null,
  time: data.runtime ?? data.time ?? '',
  budget: data.budget ?? null,
  poster: data.posterUrl ?? data.poster ?? '',
  trailer: data.trailerUrl ?? data.trailer ?? '',
  movie: data.videoUrl ?? data.movie ?? '',
  actors: ensureArray(data.actors ?? []),
  seasons: data.seasons || [],
  episodes: data.episodes || []
});

// Работа с дорамами
export const doramasService = {
  getAll: async () => {
    const docs = await getAllDocuments('doramas');
    return docs.map(normalizeDoramaDocument);
  },
  getById: async (id) => {
    const doc = await getDocumentById('doramas', id);
    return doc ? normalizeDoramaDocument(doc) : null;
  },
  add: async (doramaData) => {
    const serialized = serializeDoramaData(doramaData);
    return await addDocument('doramas', serialized);
  },
  update: async (id, doramaData) => {
    const serialized = serializeDoramaData(doramaData);
    return await updateDocument('doramas', id, serialized);
  },
  delete: (id) => deleteDocument('doramas', id),
  getByGenre: (genre) => getDocumentsWithFilter('doramas', 'genre', genre, 'array-contains')
};

// Обратная совместимость (можно удалить позже)
export const seriesService = doramasService;

const normalizeCommentDocument = (doc) => ({
  id: doc.id,
  movieId: doc.movieId,
  mediaType: doc.mediaType || 'movie',
  movieKey: doc.movieKey,
  userId: doc.userId,
  userName: doc.userName || 'Пользователь',
  text: doc.text || '',
  createdAt: doc.createdAt?.toDate ? doc.createdAt.toDate() : doc.createdAt,
  updatedAt: doc.updatedAt?.toDate ? doc.updatedAt.toDate() : doc.updatedAt
});

export const commentsService = {
  getByMovie: async (movieId, mediaType = 'movie') => {
    try {
      const movieKey = `${mediaType}:${movieId}`;
      const collectionRef = collection(db, 'comments');
      const commentsQuery = query(
        collectionRef,
        where('movieKey', '==', movieKey),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(commentsQuery);

      const comments = [];
      snapshot.forEach((docSnap) => {
        comments.push(normalizeCommentDocument({ id: docSnap.id, ...docSnap.data() }));
      });

      return comments;
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
      throw error;
    }
  },
  add: async ({ movieId, mediaType = 'movie', userId, userName, text }) => {
    try {
      const payload = {
        movieId,
        mediaType,
        movieKey: `${mediaType}:${movieId}`,
        userId,
        userName,
        text,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'comments'), payload);
      return normalizeCommentDocument({ id: docRef.id, ...payload });
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      throw error;
    }
  }
};

// Работа с пользователями
export const usersService = {
  getAll: () => getAllDocuments('users'),
  getById: (id) => getDocumentById('users', id),
  add: (userData) => addDocument('users', userData),
  update: (id, userData) => updateDocument('users', id, userData),
  delete: (id) => deleteDocument('users', id)
};

// Нормализация документа истории просмотра
const normalizeWatchHistoryDocument = (doc) => ({
  id: doc.id,
  userId: doc.userId,
  movieId: doc.movieId,
  mediaType: doc.mediaType || 'movie',
  movieKey: doc.movieKey,
  seasonNumber: doc.seasonNumber || null,
  episodeNumber: doc.episodeNumber || null,
  currentTime: doc.currentTime || 0,
  duration: doc.duration || 0,
  progress: doc.progress || 0, // Процент просмотра (0-100)
  lastWatchedAt: doc.lastWatchedAt?.toDate ? doc.lastWatchedAt.toDate() : doc.lastWatchedAt,
  createdAt: doc.createdAt?.toDate ? doc.createdAt.toDate() : doc.createdAt,
  updatedAt: doc.updatedAt?.toDate ? doc.updatedAt.toDate() : doc.updatedAt
});

// Работа с историей просмотра
export const watchHistoryService = {
  // Получить историю просмотра пользователя
  getByUser: async (userId) => {
    try {
      console.log('🔍 Запрос истории для userId:', userId);
      const collectionRef = collection(db, 'watchHistory');
      // Убираем orderBy из запроса, чтобы не требовался индекс
      // Сортировку делаем на клиенте
      const historyQuery = query(
        collectionRef,
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(historyQuery);

      console.log('🔍 Найдено документов:', snapshot.size);

      const history = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        console.log('🔍 Документ истории:', docSnap.id, data);
        history.push(normalizeWatchHistoryDocument({ id: docSnap.id, ...data }));
      });

      console.log('🔍 Нормализованная история:', history);

      // Сортируем на клиенте по дате последнего просмотра (от новых к старым)
      history.sort((a, b) => {
        const dateA = a.lastWatchedAt ? new Date(a.lastWatchedAt).getTime() : 0;
        const dateB = b.lastWatchedAt ? new Date(b.lastWatchedAt).getTime() : 0;
        return dateB - dateA;
      });

      console.log('🔍 Отсортированная история:', history);
      return history;
    } catch (error) {
      console.error('❌ Ошибка при загрузке истории просмотра:', error);
      throw error;
    }
  },

  // Получить запись истории для конкретного фильма/серии
  getByMovie: async (userId, movieId, mediaType = 'movie', seasonNumber = null, episodeNumber = null) => {
    try {
      const movieKey = `${mediaType}:${movieId}`;
      const collectionRef = collection(db, 'watchHistory');
      let historyQuery = query(
        collectionRef,
        where('userId', '==', userId),
        where('movieKey', '==', movieKey)
      );

      const snapshot = await getDocs(historyQuery);
      
      // Фильтруем по сезону и серии, если указаны
      let matchingDoc = null;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (seasonNumber !== null && episodeNumber !== null) {
          if (data.seasonNumber === seasonNumber && data.episodeNumber === episodeNumber) {
            matchingDoc = { id: docSnap.id, ...data };
          }
        } else if (seasonNumber === null && episodeNumber === null) {
          if (data.seasonNumber === null && data.episodeNumber === null) {
            matchingDoc = { id: docSnap.id, ...data };
          }
        }
      });

      return matchingDoc ? normalizeWatchHistoryDocument(matchingDoc) : null;
    } catch (error) {
      console.error('Ошибка при получении истории просмотра:', error);
      throw error;
    }
  },

  // Сохранить/обновить прогресс просмотра
  saveProgress: async (userId, movieId, mediaType, progressData) => {
    try {
      const movieKey = `${mediaType}:${movieId}`;
      const {
        currentTime = 0,
        duration = 0,
        seasonNumber = null,
        episodeNumber = null
      } = progressData;

      // Валидация данных
      if (!userId || !movieId || !mediaType) {
        throw new Error('Недостаточно данных для сохранения прогресса');
      }

      if (duration <= 0 || currentTime < 0) {
        console.warn('⚠️ Некорректные данные прогресса:', { currentTime, duration });
        return null;
      }

      const progress = Math.round((currentTime / duration) * 100);

      console.log('💾 Сохранение в БД:', {
        userId,
        movieId,
        mediaType,
        movieKey,
        seasonNumber,
        episodeNumber,
        currentTime: Math.round(currentTime),
        duration: Math.round(duration),
        progress
      });

      // Ищем существующую запись
      const existing = await watchHistoryService.getByMovie(userId, movieId, mediaType, seasonNumber, episodeNumber);

      const historyData = {
        userId,
        movieId,
        mediaType,
        movieKey,
        seasonNumber: seasonNumber !== null && seasonNumber !== undefined ? seasonNumber : null,
        episodeNumber: episodeNumber !== null && episodeNumber !== undefined ? episodeNumber : null,
        currentTime: Math.round(currentTime * 100) / 100, // Округляем до 2 знаков
        duration: Math.round(duration * 100) / 100,
        progress,
        lastWatchedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      if (existing) {
        // Обновляем существующую запись
        console.log('📝 Обновление существующей записи:', existing.id);
        const docRef = doc(db, 'watchHistory', existing.id);
        await updateDoc(docRef, historyData);
        console.log('✅ Запись обновлена');
        return { id: existing.id, ...historyData };
      } else {
        // Создаем новую запись
        console.log('➕ Создание новой записи');
        historyData.createdAt = Timestamp.now();
        const docRef = await addDoc(collection(db, 'watchHistory'), historyData);
        console.log('✅ Новая запись создана:', docRef.id);
        return { id: docRef.id, ...historyData };
      }
    } catch (error) {
      console.error('❌ Ошибка при сохранении прогресса:', error);
      throw error;
    }
  },

  // Удалить запись из истории
  delete: async (historyId) => {
    try {
      return await deleteDocument('watchHistory', historyId);
    } catch (error) {
      console.error('Ошибка при удалении из истории:', error);
      throw error;
    }
  },

  // Очистить всю историю пользователя
  clearUserHistory: async (userId) => {
    try {
      const history = await watchHistoryService.getByUser(userId);
      const deletePromises = history.map(item => watchHistoryService.delete(item.id));
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Ошибка при очистке истории:', error);
      throw error;
    }
  }
};

