import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Добавить фильм в избранное
 */
export const addToFavorites = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }

    const userData = userDoc.data();
    const favorites = userData.favorites || [];

    // Проверяем, не добавлен ли Сѓже фильм
    if (favorites.includes(movieId)) {
      return {
        success: false,
        error: 'Фильм Сѓже в избранном'
      };
    }

    // Добавляем фильм в избранное
    await updateDoc(userDocRef, {
      favorites: arrayUnion(movieId),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Фильм добавлен в избранное'
    };
  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Удалить фильм из избранного
 */
export const removeFromFavorites = async (userId, movieId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }

    // Удаляем фильм из избранного
    await updateDoc(userDocRef, {
      favorites: arrayRemove(movieId),
      updatedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Фильм удален из избранного'
    };
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Проверить, находится ли фильм в избранном
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
    console.error('Ошибка проверки избранного:', error);
    return false;
  }
};

/**
 * Получить все избранные фильмы пользователя
 */
export const getFavorites = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Пользователь не найден',
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
    console.error('Ошибка получения избранного:', error);
    return {
      success: false,
      error: error.message,
      favorites: []
    };
  }
};

