import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Р”РѕР±Р°РІРёС‚СЊ С„РёР»СЊРј РІ РёР·Р±СЂР°РЅРЅРѕРµ
 */
export const addToFavorites = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ'
      };
    }

    const userData = userDoc.data();
    const favorites = userData.favorites || [];

    // РџСЂРѕРІРµСЂСЏРµРј, РЅРµ РґРѕР±Р°РІР»РµРЅ Р»Рё СѓР¶Рµ С„РёР»СЊРј
    if (favorites.includes(movieId)) {
      return {
        success: false,
        error: 'Р¤РёР»СЊРј СѓР¶Рµ РІ РёР·Р±СЂР°РЅРЅРѕРј'
      };
    }

    // Р”РѕР±Р°РІР»СЏРµРј С„РёР»СЊРј РІ РёР·Р±СЂР°РЅРЅРѕРµ
    await updateDoc(userDocRef, {
      favorites: arrayUnion(movieId),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Р¤РёР»СЊРј РґРѕР±Р°РІР»РµРЅ РІ РёР·Р±СЂР°РЅРЅРѕРµ'
    };
  } catch (error) {
    console.error('РћС€РёР±РєР° РґРѕР±Р°РІР»РµРЅРёСЏ РІ РёР·Р±СЂР°РЅРЅРѕРµ:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * РЈРґР°Р»РёС‚СЊ С„РёР»СЊРј РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ
 */
export const removeFromFavorites = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ'
      };
    }

    // РЈРґР°Р»СЏРµРј С„РёР»СЊРј РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ
    await updateDoc(userDocRef, {
      favorites: arrayRemove(movieId),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Р¤РёР»СЊРј СѓРґР°Р»РµРЅ РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ'
    };
  } catch (error) {
    console.error('РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ РёР· РёР·Р±СЂР°РЅРЅРѕРіРѕ:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * РџСЂРѕРІРµСЂРёС‚СЊ, РЅР°С…РѕРґРёС‚СЃСЏ Р»Рё С„РёР»СЊРј РІ РёР·Р±СЂР°РЅРЅРѕРј
 */
export const isFavorite = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const favorites = userData.favorites || [];
    
    return favorites.includes(movieId);
  } catch (error) {
    console.error('РћС€РёР±РєР° РїСЂРѕРІРµСЂРєРё РёР·Р±СЂР°РЅРЅРѕРіРѕ:', error);
    return false;
  }
};

/**
 * РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ РёР·Р±СЂР°РЅРЅС‹Рµ С„РёР»СЊРјС‹ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const getFavorites = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ РЅР°Р№РґРµРЅ',
        favorites: []
      };
    }

    const userData = userDoc.data();
    const favorites = userData.favorites || [];
    
    return {
      success: true,
      favorites
    };
  } catch (error) {
    console.error('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РёР·Р±СЂР°РЅРЅРѕРіРѕ:', error);
    return {
      success: false,
      error: error.message,
      favorites: []
    };
  }
};

