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
  contentRating: doc.age || null
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
  actors: ensureArray(data.actors ?? [])
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

// Работа с пользователями
export const usersService = {
  getAll: () => getAllDocuments('users'),
  getById: (id) => getDocumentById('users', id),
  add: (userData) => addDocument('users', userData),
  update: (id, userData) => updateDocument('users', id, userData),
  delete: (id) => deleteDocument('users', id)
};

