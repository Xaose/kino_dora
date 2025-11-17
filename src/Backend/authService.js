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
 * Р РµРіРёСЃС‚СЂР°С†РёСЏ РЅРѕРІРѕРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const registerUser = async (email, password, userData = {}) => {
  try {
    // РЎРѕР·РґР°РµРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РІ Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // РћР±РЅРѕРІР»СЏРµРј РїСЂРѕС„РёР»СЊ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // РЎРѕС…СЂР°РЅСЏРµРј РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ РІ Firestore
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
    console.error('РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё:', error);
    // РџСЂРѕРІРµСЂСЏРµРј СЂР°Р·РЅС‹Рµ РІР°СЂРёР°РЅС‚С‹ РєРѕРґР° РѕС€РёР±РєРё
    const errorCode = error.code || error.message || '';
    return {
      success: false,
      error: getErrorMessage(errorCode)
    };
  }
};

/**
 * Р’С…РѕРґ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // РџРѕР»СѓС‡Р°РµРј РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ РёР· Firestore
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
    console.error('РћС€РёР±РєР° РІС…РѕРґР°:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Р’С‹С…РѕРґ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('РћС€РёР±РєР° РІС‹С…РѕРґР°:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * РџРѕР»СѓС‡РёС‚СЊ С‚РµРєСѓС‰РµРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * РћР±РЅРѕРІРёС‚СЊ РїСЂРѕС„РёР»СЊ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РІ Firestore
 * РЎРѕР·РґР°РµС‚ РґРѕРєСѓРјРµРЅС‚, РµСЃР»Рё РµРіРѕ РЅРµС‚, РёР»Рё РѕР±РЅРѕРІР»СЏРµС‚ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РёР№
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // РџСЂРѕРІРµСЂСЏРµРј, СЃСѓС‰РµСЃС‚РІСѓРµС‚ Р»Рё РґРѕРєСѓРјРµРЅС‚
    const userDoc = await getDoc(userDocRef);
    
    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    if (userDoc.exists()) {
      // Р”РѕРєСѓРјРµРЅС‚ СЃСѓС‰РµСЃС‚РІСѓРµС‚ - РѕР±РЅРѕРІР»СЏРµРј
      await updateDoc(userDocRef, updateData);
    } else {
      // Р”РѕРєСѓРјРµРЅС‚ РЅРµ СЃСѓС‰РµСЃС‚РІСѓРµС‚ - СЃРѕР·РґР°РµРј РЅРѕРІС‹Р№
      // РџРѕР»СѓС‡Р°РµРј С‚РµРєСѓС‰РµРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РґР»СЏ Р±Р°Р·РѕРІС‹С… РґР°РЅРЅС‹С…
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
    console.error('РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ РїСЂРѕС„РёР»СЏ:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * РџРѕРґРїРёСЃРєР° РЅР° РёР·РјРµРЅРµРЅРёСЏ СЃРѕСЃС‚РѕСЏРЅРёСЏ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёРё
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // РџРѕР»СѓС‡Р°РµРј РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅСѓСЋ РёРЅС„РѕСЂРјР°С†РёСЋ РёР· Firestore
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
        console.error('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РґР°РЅРЅС‹С… РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ:', error);
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
 * РџСЂРµРѕР±СЂР°Р·РѕРІР°РЅРёРµ РєРѕРґР° РѕС€РёР±РєРё Firebase РІ РїРѕРЅСЏС‚РЅРѕРµ СЃРѕРѕР±С‰РµРЅРёРµ
 */
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Р­С‚РѕС‚ email СѓР¶Рµ РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ',
    'auth/invalid-email': 'РќРµРІРµСЂРЅС‹Р№ С„РѕСЂРјР°С‚ email',
    'auth/operation-not-allowed': 'РћРїРµСЂР°С†РёСЏ РЅРµ СЂР°Р·СЂРµС€РµРЅР°',
    'auth/weak-password': 'РџР°СЂРѕР»СЊ СЃР»РёС€РєРѕРј СЃР»Р°Р±С‹Р№ (РјРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ)',
    'auth/user-disabled': 'Р­С‚РѕС‚ Р°РєРєР°СѓРЅС‚ Р±С‹Р» РѕС‚РєР»СЋС‡РµРЅ',
    'auth/user-not-found': 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃ С‚Р°РєРёРј email РЅРµ РЅР°Р№РґРµРЅ',
    'auth/wrong-password': 'РќРµРІРµСЂРЅС‹Р№ РїР°СЂРѕР»СЊ',
    'auth/invalid-credential': 'РќРµРІРµСЂРЅС‹Р№ email РёР»Рё РїР°СЂРѕР»СЊ',
    'auth/too-many-requests': 'РЎР»РёС€РєРѕРј РјРЅРѕРіРѕ РїРѕРїС‹С‚РѕРє. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ',
    'auth/network-request-failed': 'РћС€РёР±РєР° СЃРµС‚Рё. РџСЂРѕРІРµСЂСЊС‚Рµ РїРѕРґРєР»СЋС‡РµРЅРёРµ Рє РёРЅС‚РµСЂРЅРµС‚Сѓ',
    'permission-denied': 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РїСЂР°РІ РґРѕСЃС‚СѓРїР°. РџСЂРѕРІРµСЂСЊС‚Рµ РїСЂР°РІРёР»Р° Firestore РІ Firebase Console',
    'Missing or insufficient permissions': 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РїСЂР°РІ РґРѕСЃС‚СѓРїР°. РџСЂРѕРІРµСЂСЊС‚Рµ РїСЂР°РІРёР»Р° Firestore РІ Firebase Console'
  };

  // РџСЂРѕРІРµСЂСЏРµРј, РµСЃС‚СЊ Р»Рё РєРѕРґ РѕС€РёР±РєРё РІ СЃРѕРѕР±С‰РµРЅРёСЏС…
  if (errorMessages[errorCode]) {
    return errorMessages[errorCode];
  }

  // РџСЂРѕРІРµСЂСЏРµРј, СЃРѕРґРµСЂР¶РёС‚ Р»Рё СЃРѕРѕР±С‰РµРЅРёРµ РѕР± РѕС€РёР±РєРµ РєР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР°
  if (errorCode && errorCode.includes('permission')) {
    return 'РќРµРґРѕСЃС‚Р°С‚РѕС‡РЅРѕ РїСЂР°РІ РґРѕСЃС‚СѓРїР°. РџСЂРѕРІРµСЂСЊС‚Рµ РїСЂР°РІРёР»Р° Firestore РІ Firebase Console';
  }

  return errorMessages[errorCode] || `РџСЂРѕРёР·РѕС€Р»Р° РѕС€РёР±РєР°: ${errorCode || 'РќРµРёР·РІРµСЃС‚РЅР°СЏ РѕС€РёР±РєР°'}`;
};

