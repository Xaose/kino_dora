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
 * РЎРµСЂРІРёСЃ РґР»СЏ СЂР°Р±РѕС‚С‹ СЃ Firebase Storage
 * РџСЂРµРґРЅР°Р·РЅР°С‡РµРЅ РґР»СЏ Р·Р°РіСЂСѓР·РєРё Рё СѓРїСЂР°РІР»РµРЅРёСЏ РІРёРґРµРѕ С„Р°Р№Р»Р°РјРё
 */

/**
 * Р—Р°РіСЂСѓР·РёС‚СЊ РІРёРґРµРѕ С„Р°Р№Р» РІ Firebase Storage
 * @param {File} file - Р¤Р°Р№Р» РІРёРґРµРѕ РґР»СЏ Р·Р°РіСЂСѓР·РєРё
 * @param {string} path - РџСѓС‚СЊ РІ Storage (РЅР°РїСЂРёРјРµСЂ, 'movies/video_id.mp4')
 * @param {Function} onProgress - Callback РґР»СЏ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РїСЂРѕРіСЂРµСЃСЃР° (progress: number) => void
 * @returns {Promise<string>} - URL Р·Р°РіСЂСѓР¶РµРЅРЅРѕРіРѕ РІРёРґРµРѕ
 */
export const uploadVideo = async (file, path, onProgress = null) => {
  try {
    // РџСЂРѕРІРµСЂРєР° С‚РёРїР° С„Р°Р№Р»Р°
    if (!file.type.startsWith('video/')) {
      throw new Error('Р¤Р°Р№Р» РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РІРёРґРµРѕ');
    }

    // РЎРѕР·РґР°РµРј СЃСЃС‹Р»РєСѓ РЅР° С„Р°Р№Р» РІ Storage
    const storageRef = ref(storage, path);
    
    // РЎРѕР·РґР°РµРј Р·Р°РґР°С‡Сѓ Р·Р°РіСЂСѓР·РєРё СЃ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊСЋ РѕС‚СЃР»РµР¶РёРІР°РЅРёСЏ РїСЂРѕРіСЂРµСЃСЃР°
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Р’РѕР·РІСЂР°С‰Р°РµРј Promise, РєРѕС‚РѕСЂС‹Р№ СЂР°Р·СЂРµС€РёС‚СЃСЏ РїРѕСЃР»Рµ Р·Р°РіСЂСѓР·РєРё
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // РћС‚СЃР»РµР¶РёРІР°РЅРёРµ РїСЂРѕРіСЂРµСЃСЃР°
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // РћР±СЂР°Р±РѕС‚РєР° РѕС€РёР±РѕРє
          console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РІРёРґРµРѕ:', error);
          reject(error);
        },
        async () => {
          // Р—Р°РіСЂСѓР·РєР° Р·Р°РІРµСЂС€РµРЅР°, РїРѕР»СѓС‡Р°РµРј URL
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
    console.error('РћС€РёР±РєР° РїСЂРё Р·Р°РіСЂСѓР·РєРµ РІРёРґРµРѕ:', error);
    throw error;
  }
};

/**
 * РџРѕР»СѓС‡РёС‚СЊ URL РІРёРґРµРѕ РёР· Firebase Storage
 * @param {string} path - РџСѓС‚СЊ Рє С„Р°Р№Р»Сѓ РІ Storage
 * @returns {Promise<string>} - URL РІРёРґРµРѕ
 */
export const getVideoUrl = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё URL РІРёРґРµРѕ:', error);
    throw error;
  }
};

/**
 * РЈРґР°Р»РёС‚СЊ РІРёРґРµРѕ РёР· Firebase Storage
 * @param {string} path - РџСѓС‚СЊ Рє С„Р°Р№Р»Сѓ РІ Storage
 * @returns {Promise<void>}
 */
export const deleteVideo = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё РІРёРґРµРѕ:', error);
    throw error;
  }
};

/**
 * РџРѕР»СѓС‡РёС‚СЊ РјРµС‚Р°РґР°РЅРЅС‹Рµ РІРёРґРµРѕ
 * @param {string} path - РџСѓС‚СЊ Рє С„Р°Р№Р»Сѓ РІ Storage
 * @returns {Promise<Object>} - РњРµС‚Р°РґР°РЅРЅС‹Рµ С„Р°Р№Р»Р°
 */
export const getVideoMetadata = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return metadata;
  } catch (error) {
    console.error('РћС€РёР±РєР° РїСЂРё РїРѕР»СѓС‡РµРЅРёРё РјРµС‚Р°РґР°РЅРЅС‹С…:', error);
    throw error;
  }
};

/**
 * РџСЂРѕРІРµСЂРёС‚СЊ, СЏРІР»СЏРµС‚СЃСЏ Р»Рё URL СЃСЃС‹Р»РєРѕР№ РЅР° Firebase Storage
 * @param {string} url - URL РґР»СЏ РїСЂРѕРІРµСЂРєРё
 * @returns {boolean}
 */
export const isFirebaseStorageUrl = (url) => {
  if (!url) return false;
  return url.includes('firebasestorage.googleapis.com') || 
         url.includes('firebasestorage.app');
};

/**
 * РР·РІР»РµС‡СЊ РїСѓС‚СЊ РёР· Firebase Storage URL
 * @param {string} url - Firebase Storage URL
 * @returns {string|null} - РџСѓС‚СЊ Рє С„Р°Р№Р»Сѓ РёР»Рё null
 */
export const extractPathFromUrl = (url) => {
  if (!isFirebaseStorageUrl(url)) return null;
  
  try {
    const urlObj = new URL(url);
    // РџСѓС‚СЊ РѕР±С‹С‡РЅРѕ РЅР°С…РѕРґРёС‚СЃСЏ РїРѕСЃР»Рµ /o/ РІ URL
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    if (pathMatch) {
      return decodeURIComponent(pathMatch[1]);
    }
  } catch (error) {
    console.error('РћС€РёР±РєР° РїСЂРё РёР·РІР»РµС‡РµРЅРёРё РїСѓС‚Рё:', error);
  }
  
  return null;
};

/**
 * Р—Р°РіСЂСѓР·РёС‚СЊ РІРёРґРµРѕ РґР»СЏ С„РёР»СЊРјР°
 * @param {File} file - Р¤Р°Р№Р» РІРёРґРµРѕ
 * @param {string} movieId - ID С„РёР»СЊРјР°
 * @param {Function} onProgress - Callback РґР»СЏ РїСЂРѕРіСЂРµСЃСЃР°
 * @returns {Promise<string>} - URL Р·Р°РіСЂСѓР¶РµРЅРЅРѕРіРѕ РІРёРґРµРѕ
 */
export const uploadMovieVideo = async (file, movieId, onProgress = null) => {
  const fileExtension = file.name.split('.').pop();
  const path = `movies/${movieId}/video.${fileExtension}`;
  return uploadVideo(file, path, onProgress);
};

/**
 * Р—Р°РіСЂСѓР·РёС‚СЊ РїРѕСЃС‚РµСЂ РґР»СЏ С„РёР»СЊРјР°
 * @param {File} file - Р¤Р°Р№Р» РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
 * @param {string} movieId - ID С„РёР»СЊРјР°
 * @param {Function} onProgress - Callback РґР»СЏ РїСЂРѕРіСЂРµСЃСЃР°
 * @returns {Promise<string>} - URL Р·Р°РіСЂСѓР¶РµРЅРЅРѕРіРѕ РїРѕСЃС‚РµСЂР°
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
          console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РїРѕСЃС‚РµСЂР°:', error);
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
    console.error('РћС€РёР±РєР° РїСЂРё Р·Р°РіСЂСѓР·РєРµ РїРѕСЃС‚РµСЂР°:', error);
    throw error;
  }
};

/**
 * Р—Р°РіСЂСѓР·РёС‚СЊ Р°РІР°С‚Р°СЂ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 * @param {File} file - Р¤Р°Р№Р» РёР·РѕР±СЂР°Р¶РµРЅРёСЏ
 * @param {string} userId - ID РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 * @param {Function} onProgress - Callback РґР»СЏ РїСЂРѕРіСЂРµСЃСЃР°
 * @returns {Promise<string>} - URL Р·Р°РіСЂСѓР¶РµРЅРЅРѕРіРѕ Р°РІР°С‚Р°СЂР°
 */
export const uploadUserAvatar = async (file, userId, onProgress = null) => {
  // РџСЂРѕРІРµСЂРєР° С‚РёРїР° С„Р°Р№Р»Р°
  if (!file.type.startsWith('image/')) {
    throw new Error('Р¤Р°Р№Р» РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РёР·РѕР±СЂР°Р¶РµРЅРёРµРј');
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
          console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё Р°РІР°С‚Р°СЂР°:', error);
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
    console.error('РћС€РёР±РєР° РїСЂРё Р·Р°РіСЂСѓР·РєРµ Р°РІР°С‚Р°СЂР°:', error);
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

