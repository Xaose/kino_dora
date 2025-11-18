import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

/**
 * Регистрация нового пользователя
 */
export const registerUser = async (email, password, userData = {}) => {
  try {
    // Создаем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Обновляем профиль пользователя
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // Сохраняем дополнительную информацию в Firestore
    const userDoc = {
      uid: user.uid,
      email: user.email,
      name: userData.name || '',
      username: userData.username || '',
      profileImage: userData.profileImage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userDoc
      }
    };
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    // Проверяем разные варианты кода ошибки
    const errorCode = error.code || error.message || '';
    return {
      success: false,
      error: getErrorMessage(errorCode)
    };
  }
};

/**
 * Вход пользователя
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Получаем дополнительную информацию из Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        ...userData
      }
    };
  } catch (error) {
    console.error('Ошибка входа:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Выход пользователя
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Ошибка выхода:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Получить текущего пользователя
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Обновить профиль пользователя в Firestore
 * Создает документ, если его нет, или обновляет существующий
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Проверяем, существует ли документ
    const userDoc = await getDoc(userDocRef);
    
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    if (userDoc.exists()) {
      // Документ существует - обновляем
      await updateDoc(userDocRef, updateData);
    } else {
      // Документ не существует - создаем новый
      // Получаем текущего пользователя для базовых данных
      const currentUser = auth.currentUser;
      const newUserDoc = {
        uid: userId,
        email: currentUser?.email || '',
        name: userData.name || '',
        username: userData.username || '',
        profileImage: userData.profileImage || null,
        createdAt: new Date().toISOString(),
        ...updateData
      };
      await setDoc(userDocRef, newUserDoc);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Подписка на изменения состояния аутентификации
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Получаем дополнительную информацию из Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userData
        });
      } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Преобразование кода ошибки Firebase в понятное сообщение
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Этот email Сѓже используется',
    'auth/invalid-email': 'Неверный формат email',
    'auth/operation-not-allowed': 'Операция не разрешена',
    'auth/weak-password': 'Пароль слишком слабый (минимум 6 символов)',
    'auth/user-disabled': 'Этот аккаунт был отключен',
    'auth/user-not-found': 'Пользователь с таким email не найден',
    'auth/wrong-password': 'Неверный пароль',
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету',
    'permission-denied': 'Недостаточно прав доступа. Проверьте правила Firestore в Firebase Console',
    'Missing or insufficient permissions': 'Недостаточно прав доступа. Проверьте правила Firestore в Firebase Console'
  };

  // Проверяем, есть ли код ошибки в сообщениях
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }

  // Проверяем, содержит ли сообщение об ошибке ключевые слова
  if (errorCode && errorCode.includes('permission')) {
    return 'Недостаточно прав доступа. Проверьте правила Firestore в Firebase Console';
  }

  return errorMessages[errorCode] || `Произошла ошибка: ${errorCode || 'Неизвестная ошибка'}`;
};

