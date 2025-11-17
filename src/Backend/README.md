# Firebase Backend Setup

Р­С‚РѕС‚ СЂР°Р·РґРµР» СЃРѕРґРµСЂР¶РёС‚ РЅР°СЃС‚СЂРѕР№РєСѓ Рё РїРѕРґРєР»СЋС‡РµРЅРёРµ Рє Firebase РґР»СЏ СЂР°Р±РѕС‚С‹ СЃ Р±Р°Р·РѕР№ РґР°РЅРЅС‹С….

## РќР°СЃС‚СЂРѕР№РєР° Firebase

### 1. РЎРѕР·РґР°Р№С‚Рµ РїСЂРѕРµРєС‚ РІ Firebase Console

1. РџРµСЂРµР№РґРёС‚Рµ РЅР° [Firebase Console](https://console.firebase.google.com/)
2. РќР°Р¶РјРёС‚Рµ "Add project" (Р”РѕР±Р°РІРёС‚СЊ РїСЂРѕРµРєС‚)
3. Р’РІРµРґРёС‚Рµ РЅР°Р·РІР°РЅРёРµ РїСЂРѕРµРєС‚Р° (РЅР°РїСЂРёРјРµСЂ, "kino-dora")
4. РЎР»РµРґСѓР№С‚Рµ РёРЅСЃС‚СЂСѓРєС†РёСЏРј РґР»СЏ СЃРѕР·РґР°РЅРёСЏ РїСЂРѕРµРєС‚Р°

### 2. Р’РєР»СЋС‡РёС‚Рµ Firestore Database

1. Р’ Firebase Console РІС‹Р±РµСЂРёС‚Рµ РІР°С€ РїСЂРѕРµРєС‚
2. РџРµСЂРµР№РґРёС‚Рµ РІ СЂР°Р·РґРµР» **Firestore Database**
3. РќР°Р¶РјРёС‚Рµ **Create database**
4. Р’С‹Р±РµСЂРёС‚Рµ СЂРµР¶РёРј:
   - **Production mode** (СЂРµРєРѕРјРµРЅРґСѓРµС‚СЃСЏ РґР»СЏ РїСЂРѕРґР°РєС€РµРЅР°)
   - **Test mode** (РґР»СЏ СЂР°Р·СЂР°Р±РѕС‚РєРё, РЅРѕ РјРµРЅРµРµ Р±РµР·РѕРїР°СЃРЅРѕ)
5. Р’С‹Р±РµСЂРёС‚Рµ СЂРµРіРёРѕРЅ РґР»СЏ Р±Р°Р·С‹ РґР°РЅРЅС‹С… (РЅР°РїСЂРёРјРµСЂ, `europe-west`)

### 3. РџРѕР»СѓС‡РёС‚Рµ РєРѕРЅС„РёРіСѓСЂР°С†РёРѕРЅРЅС‹Рµ РґР°РЅРЅС‹Рµ

1. Р’ Firebase Console РїРµСЂРµР№РґРёС‚Рµ РІ **Project Settings** (вљ™пёЏ)
2. РџСЂРѕРєСЂСѓС‚РёС‚Рµ РІРЅРёР· РґРѕ СЂР°Р·РґРµР»Р° **Your apps**
3. РќР°Р¶РјРёС‚Рµ РЅР° РёРєРѕРЅРєСѓ РІРµР±-РїСЂРёР»РѕР¶РµРЅРёСЏ (`</>`) РёР»Рё **Add app** > **Web**
4. Р—Р°СЂРµРіРёСЃС‚СЂРёСЂСѓР№С‚Рµ РїСЂРёР»РѕР¶РµРЅРёРµ (РјРѕР¶РЅРѕ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ Р»СЋР±РѕРµ РёРјСЏ)
5. РЎРєРѕРїРёСЂСѓР№С‚Рµ РєРѕРЅС„РёРіСѓСЂР°С†РёРѕРЅРЅС‹Р№ РѕР±СЉРµРєС‚ `firebaseConfig`

### 4. РЎРѕР·РґР°Р№С‚Рµ С„Р°Р№Р» .env

Р’ РєРѕСЂРЅРµ РїСЂРѕРµРєС‚Р° СЃРѕР·РґР°Р№С‚Рµ С„Р°Р№Р» `.env` СЃРѕ СЃР»РµРґСѓСЋС‰РёРј СЃРѕРґРµСЂР¶РёРјС‹Рј:

```env
REACT_APP_FIREBASE_API_KEY=РІР°С€_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=РІР°С€_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=РІР°С€_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=РІР°С€_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=РІР°С€_sender_id
REACT_APP_FIREBASE_APP_ID=РІР°С€_app_id
```

**Р’РђР–РќРћ:** Р—Р°РјРµРЅРёС‚Рµ РІСЃРµ Р·РЅР°С‡РµРЅРёСЏ РЅР° СЂРµР°Р»СЊРЅС‹Рµ РґР°РЅРЅС‹Рµ РёР· Firebase Console!

### 5. РќР°СЃС‚СЂРѕР№С‚Рµ РїСЂР°РІРёР»Р° Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё Firestore

Р’ Firebase Console РїРµСЂРµР№РґРёС‚Рµ РІ **Firestore Database** > **Rules** Рё РЅР°СЃС‚СЂРѕР№С‚Рµ РїСЂР°РІРёР»Р° РґРѕСЃС‚СѓРїР°. Р”Р»СЏ РЅР°С‡Р°Р»Р° РјРѕР¶РЅРѕ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Р Р°Р·СЂРµС€РёС‚СЊ С‡С‚РµРЅРёРµ РІСЃРµРј, Р·Р°РїРёСЃСЊ С‚РѕР»СЊРєРѕ Р°СѓС‚РµРЅС‚РёС„РёС†РёСЂРѕРІР°РЅРЅС‹Рј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРј
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Р’РЅРёРјР°РЅРёРµ:** Р­С‚Рё РїСЂР°РІРёР»Р° РѕС‚РєСЂС‹РІР°СЋС‚ С‡С‚РµРЅРёРµ РґР»СЏ РІСЃРµС…. Р”Р»СЏ РїСЂРѕРґР°РєС€РµРЅР° РЅР°СЃС‚СЂРѕР№С‚Рµ Р±РѕР»РµРµ СЃС‚СЂРѕРіРёРµ РїСЂР°РІРёР»Р°!

## РСЃРїРѕР»СЊР·РѕРІР°РЅРёРµ

### РРјРїРѕСЂС‚ РІ РєРѕРјРїРѕРЅРµРЅС‚Р°С…

```javascript
import { db } from '../Backend/firebaseConfig';
import { moviesService } from '../Backend/database';

// РџРѕР»СѓС‡РёС‚СЊ РІСЃРµ С„РёР»СЊРјС‹
const movies = await moviesService.getAll();

// РџРѕР»СѓС‡РёС‚СЊ С„РёР»СЊРј РїРѕ ID
const movie = await moviesService.getById('movie_id');

// Р”РѕР±Р°РІРёС‚СЊ РЅРѕРІС‹Р№ С„РёР»СЊРј
const newMovieId = await moviesService.add({
  title: 'РќР°Р·РІР°РЅРёРµ С„РёР»СЊРјР°',
  genre: 'Р”СЂР°РјР°',
  year: 2024
});
```

### РџСЂРёРјРµСЂ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ РІ РєРѕРјРїРѕРЅРµРЅС‚Рµ React

```javascript
import { useState, useEffect } from 'react';
import { moviesService } from '../Backend/database';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesService.getAll();
        setMovies(data);
      } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё С„РёР»СЊРјРѕРІ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Р—Р°РіСЂСѓР·РєР°...</div>;

  return (
    <div>
      {movies.map(movie => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

## Р”РѕСЃС‚СѓРїРЅС‹Рµ СЃРµСЂРІРёСЃС‹

- `moviesService` - СЂР°Р±РѕС‚Р° СЃ С„РёР»СЊРјР°РјРё
- `seriesService` - СЂР°Р±РѕС‚Р° СЃ СЃРµСЂРёР°Р»Р°РјРё
- `usersService` - СЂР°Р±РѕС‚Р° СЃ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏРјРё

РљР°Р¶РґС‹Р№ СЃРµСЂРІРёСЃ РёРјРµРµС‚ РјРµС‚РѕРґС‹:
- `getAll()` - РїРѕР»СѓС‡РёС‚СЊ РІСЃРµ РґРѕРєСѓРјРµРЅС‚С‹
- `getById(id)` - РїРѕР»СѓС‡РёС‚СЊ РґРѕРєСѓРјРµРЅС‚ РїРѕ ID
- `add(data)` - РґРѕР±Р°РІРёС‚СЊ РЅРѕРІС‹Р№ РґРѕРєСѓРјРµРЅС‚
- `update(id, data)` - РѕР±РЅРѕРІРёС‚СЊ РґРѕРєСѓРјРµРЅС‚
- `delete(id)` - СѓРґР°Р»РёС‚СЊ РґРѕРєСѓРјРµРЅС‚

## Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ С„СѓРЅРєС†РёРё

Р’ С„Р°Р№Р»Рµ `database.js` С‚Р°РєР¶Рµ РґРѕСЃС‚СѓРїРЅС‹ Р±Р°Р·РѕРІС‹Рµ С„СѓРЅРєС†РёРё:
- `getAllDocuments(collectionName)`
- `getDocumentById(collectionName, documentId)`
- `addDocument(collectionName, data)`
- `updateDocument(collectionName, documentId, data)`
- `deleteDocument(collectionName, documentId)`
- `getDocumentsWithFilter(collectionName, field, value)`
- `getDocumentsOrdered(collectionName, field, direction, limit)`

