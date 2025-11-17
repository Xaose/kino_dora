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
  title: doc.name || doc.title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ',
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
 * Р‘Р°Р·РѕРІС‹Рµ РѕРїРµСЂР°С†РёРё СЃ Р±Р°Р·РѕР№ РґР°РЅРЅС‹С… Firestore
 */

// РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РґРѕРєСѓРјРµРЅС‚С‹ РёР· РєРѕР»Р»РµРєС†РёРё
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
    console.error(`РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РґРѕРєСѓРјРµРЅС‚РѕРІ РёР· ${collectionName}:`, error);
    throw error;
  }
};

// РџРѕР»СѓС‡РёС‚СЊ РѕРґРёРЅ РґРѕРєСѓРјРµРЅС‚ РїРѕ ID
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
      throw new Error(`Р”РѕРєСѓРјРµРЅС‚ СЃ ID ${documentId} РЅРµ РЅР°Р№РґРµРЅ`);
    }
  } catch (error) {
    console.error(`РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РґРѕРєСѓРјРµРЅС‚Р° ${documentId}:`, error);
    throw error;
  }
};

// Р”РѕР±Р°РІРёС‚СЊ РЅРѕРІС‹Р№ РґРѕРєСѓРјРµРЅС‚
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
    console.error(`РћС€РёР±РєР° РїСЂРё РґРѕР±Р°РІР»РµРЅРёРё РґРѕРєСѓРјРµРЅС‚Р° РІ ${collectionName}:`, error);
    throw error;
  }
};

// РћР±РЅРѕРІРёС‚СЊ РґРѕРєСѓРјРµРЅС‚
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error(`РћС€РёР±РєР° РїСЂРё РѕР±РЅРѕРІР»РµРЅРёРё РґРѕРєСѓРјРµРЅС‚Р° ${documentId}:`, error);
    throw error;
  }
};

// РЈРґР°Р»РёС‚СЊ РґРѕРєСѓРјРµРЅС‚
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error(`РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё РґРѕРєСѓРјРµРЅС‚Р° ${documentId}:`, error);
    throw error;
  }
};

// РџРѕР»СѓС‡РёС‚СЊ РґРѕРєСѓРјРµРЅС‚С‹ СЃ С„РёР»СЊС‚СЂР°С†РёРµР№
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
    console.error(`РћС€РёР±РєР° РїСЂРё С„РёР»СЊС‚СЂР°С†РёРё РґРѕРєСѓРјРµРЅС‚РѕРІ:`, error);
    throw error;
  }
};

// РџРѕР»СѓС‡РёС‚СЊ РґРѕРєСѓРјРµРЅС‚С‹ СЃ СЃРѕСЂС‚РёСЂРѕРІРєРѕР№
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
    console.error(`РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РѕС‚СЃРѕСЂС‚РёСЂРѕРІР°РЅРЅС‹С… РґРѕРєСѓРјРµРЅС‚РѕРІ:`, error);
    throw error;
  }
};

// РџСЂРёРјРµСЂС‹ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РґР»СЏ РІР°С€РµРіРѕ РїСЂРѕРµРєС‚Р°:

// Р Р°Р±РѕС‚Р° СЃ С„РёР»СЊРјР°РјРё
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

// РќРѕСЂРјР°Р»РёР·Р°С†РёСЏ РґРѕРєСѓРјРµРЅС‚Р° РґРѕСЂР°РјС‹
const normalizeDoramaDocument = (doc) => ({
  id: doc.id,
  title: doc.name || doc.title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ',
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

// РЎРµСЂРёР°Р»РёР·Р°С†РёСЏ РґР°РЅРЅС‹С… РґРѕСЂР°РјС‹
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

// Р Р°Р±РѕС‚Р° СЃ РґРѕСЂР°РјР°РјРё
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

// РћР±СЂР°С‚РЅР°СЏ СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚СЊ (РјРѕР¶РЅРѕ СѓРґР°Р»РёС‚СЊ РїРѕР·Р¶Рµ)
export const seriesService = doramasService;

// Р Р°Р±РѕС‚Р° СЃ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРјРё
export const usersService = {
  getAll: () => getAllDocuments('users'),
  getById: (id) => getDocumentById('users', id),
  add: (userData) => addDocument('users', userData),
  update: (id, userData) => updateDocument('users', id, userData),
  delete: (id) => deleteDocument('users', id)
};

