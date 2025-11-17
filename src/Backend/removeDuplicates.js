import { moviesService, getAllDocuments } from './database';
import { getCurrentUser } from './authService';

/**
 * Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕРёСЃРєР° Рё СѓРґР°Р»РµРЅРёСЏ РґСѓР±Р»РёРєР°С‚РѕРІ С„РёР»СЊРјРѕРІ
 * Р”СѓР±Р»РёРєР°С‚С‹ РѕРїСЂРµРґРµР»СЏСЋС‚СЃСЏ РїРѕ РЅР°Р·РІР°РЅРёСЋ (СЃ СѓС‡РµС‚РѕРј СЂРµРіРёСЃС‚СЂР°)
 */
export const removeDuplicateMovies = async () => {
  try {
    // РџСЂРѕРІРµСЂСЏРµРј Р°РІС‚РѕСЂРёР·Р°С†РёСЋ
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Р”Р»СЏ СѓРґР°Р»РµРЅРёСЏ РґСѓР±Р»РёРєР°С‚РѕРІ РЅРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ');
    }

    console.log('РќР°С‡РёРЅР°СЋ РїРѕРёСЃРє РґСѓР±Р»РёРєР°С‚РѕРІ С„РёР»СЊРјРѕРІ...');
    console.log('РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ:', user.email);

    // РџРѕР»СѓС‡Р°РµРј РІСЃРµ С„РёР»СЊРјС‹ (СЃС‹СЂС‹Рµ РґР°РЅРЅС‹Рµ РґР»СЏ РґРѕСЃС‚СѓРїР° Рє createdAt)
    const rawMovies = await getAllDocuments('movies');
    console.log(`Р’СЃРµРіРѕ С„РёР»СЊРјРѕРІ РІ Р±Р°Р·Рµ: ${rawMovies.length}`);

    // РќРѕСЂРјР°Р»РёР·СѓРµРј РЅР°Р·РІР°РЅРёСЏ РґР»СЏ СЃСЂР°РІРЅРµРЅРёСЏ
    const moviesByTitle = {};
    
    rawMovies.forEach((movie) => {
      // РСЃРїРѕР»СЊР·СѓРµРј name РёР»Рё title РґР»СЏ СЃСЂР°РІРЅРµРЅРёСЏ
      const title = (movie.name || movie.title || '').trim().toLowerCase();
      if (!title) return; // РџСЂРѕРїСѓСЃРєР°РµРј С„РёР»СЊРјС‹ Р±РµР· РЅР°Р·РІР°РЅРёСЏ
      
      if (!moviesByTitle[title]) {
        moviesByTitle[title] = [];
      }
      moviesByTitle[title].push(movie);
    });

    // РќР°С…РѕРґРёРј РґСѓР±Р»РёРєР°С‚С‹ (РЅР°Р·РІР°РЅРёСЏ СЃ Р±РѕР»РµРµ С‡РµРј РѕРґРЅРёРј С„РёР»СЊРјРѕРј)
    const duplicates = {};
    let totalDuplicates = 0;

    Object.keys(moviesByTitle).forEach((title) => {
      if (moviesByTitle[title].length > 1) {
        duplicates[title] = moviesByTitle[title];
        totalDuplicates += moviesByTitle[title].length - 1; // -1 РїРѕС‚РѕРјСѓ С‡С‚Рѕ РѕРґРёРЅ РѕСЃС‚Р°РІР»СЏРµРј
      }
    });

    console.log(`\nРќР°Р№РґРµРЅРѕ ${Object.keys(duplicates).length} СѓРЅРёРєР°Р»СЊРЅС‹С… РЅР°Р·РІР°РЅРёР№ СЃ РґСѓР±Р»РёРєР°С‚Р°РјРё`);
    console.log(`Р’СЃРµРіРѕ РґСѓР±Р»РёРєР°С‚РѕРІ РґР»СЏ СѓРґР°Р»РµРЅРёСЏ: ${totalDuplicates}`);

    if (Object.keys(duplicates).length === 0) {
      console.log('вњ“ Р”СѓР±Р»РёРєР°С‚С‹ РЅРµ РЅР°Р№РґРµРЅС‹!');
      return {
        success: true,
        duplicatesFound: 0,
        duplicatesRemoved: 0,
        message: 'Р”СѓР±Р»РёРєР°С‚С‹ РЅРµ РЅР°Р№РґРµРЅС‹'
      };
    }

    // РџРѕРєР°Р·С‹РІР°РµРј РЅР°Р№РґРµРЅРЅС‹Рµ РґСѓР±Р»РёРєР°С‚С‹
    console.log('\n=== РќР°Р№РґРµРЅРЅС‹Рµ РґСѓР±Р»РёРєР°С‚С‹ ===');
    Object.keys(duplicates).forEach((title) => {
      const movies = duplicates[title];
      const displayTitle = movies[0].name || movies[0].title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ';
      console.log(`\n"${displayTitle}" (${movies.length} РєРѕРїРёР№):`);
      movies.forEach((movie, index) => {
        let dateStr = 'РЅРµРёР·РІРµСЃС‚РЅРѕ';
        if (movie.createdAt) {
          try {
            if (movie.createdAt.toDate) {
              dateStr = movie.createdAt.toDate().toLocaleString('ru-RU');
            } else if (movie.createdAt.seconds) {
              dateStr = new Date(movie.createdAt.seconds * 1000).toLocaleString('ru-RU');
            } else if (typeof movie.createdAt === 'string') {
              dateStr = new Date(movie.createdAt).toLocaleString('ru-RU');
            }
          } catch (e) {
            dateStr = 'РЅРµРёР·РІРµСЃС‚РЅРѕ';
          }
        }
        console.log(`  ${index + 1}. ID: ${movie.id}, СЃРѕР·РґР°РЅ: ${dateStr}`);
      });
    });

    // РЈРґР°Р»СЏРµРј РґСѓР±Р»РёРєР°С‚С‹ (РѕСЃС‚Р°РІР»СЏРµРј СЃР°РјС‹Р№ РЅРѕРІС‹Р№, СѓРґР°Р»СЏРµРј РѕСЃС‚Р°Р»СЊРЅС‹Рµ)
    const results = [];
    let removedCount = 0;

    for (const title of Object.keys(duplicates)) {
      const movies = duplicates[title];
      
      // РЎРѕСЂС‚РёСЂСѓРµРј РїРѕ РґР°С‚Рµ СЃРѕР·РґР°РЅРёСЏ (СЃР°РјС‹Р№ РЅРѕРІС‹Р№ РїРµСЂРІС‹Р№)
      movies.sort((a, b) => {
        let dateA = new Date(0);
        let dateB = new Date(0);
        
        // РћР±СЂР°Р±Р°С‚С‹РІР°РµРј Timestamp РёР· Firestore
        if (a.createdAt) {
          if (a.createdAt.toDate) {
            dateA = a.createdAt.toDate();
          } else if (a.createdAt.seconds) {
            dateA = new Date(a.createdAt.seconds * 1000);
          } else if (typeof a.createdAt === 'string') {
            dateA = new Date(a.createdAt);
          }
        }
        
        if (b.createdAt) {
          if (b.createdAt.toDate) {
            dateB = b.createdAt.toDate();
          } else if (b.createdAt.seconds) {
            dateB = new Date(b.createdAt.seconds * 1000);
          } else if (typeof b.createdAt === 'string') {
            dateB = new Date(b.createdAt);
          }
        }
        
        return dateB.getTime() - dateA.getTime(); // РќРѕРІС‹Рµ РїРµСЂРІС‹РјРё
      });

      // РћСЃС‚Р°РІР»СЏРµРј РїРµСЂРІС‹Р№ (СЃР°РјС‹Р№ РЅРѕРІС‹Р№), СѓРґР°Р»СЏРµРј РѕСЃС‚Р°Р»СЊРЅС‹Рµ
      const toKeep = movies[0];
      const toRemove = movies.slice(1);

      const keepTitle = toKeep.name || toKeep.title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ';
      console.log(`\nРћСЃС‚Р°РІР»СЏРµРј: "${keepTitle}" (ID: ${toKeep.id})`);
      
      for (const movie of toRemove) {
        try {
          await moviesService.delete(movie.id);
          removedCount++;
          const movieTitle = movie.name || movie.title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ';
          console.log(`  вњ“ РЈРґР°Р»РµРЅ РґСѓР±Р»РёРєР°С‚: "${movieTitle}" (ID: ${movie.id})`);
          results.push({
            success: true,
            title: movieTitle,
            id: movie.id,
            action: 'deleted'
          });
        } catch (error) {
          const movieTitle = movie.name || movie.title || 'Р‘РµР· РЅР°Р·РІР°РЅРёСЏ';
          console.error(`  вњ— РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё "${movieTitle}" (ID: ${movie.id}):`, error);
          results.push({
            success: false,
            title: movieTitle,
            id: movie.id,
            error: error.message,
            action: 'delete_failed'
          });
        }
      }
    }

    console.log(`\n=== Р РµР·СѓР»СЊС‚Р°С‚С‹ ===`);
    console.log(`вњ“ РЈСЃРїРµС€РЅРѕ СѓРґР°Р»РµРЅРѕ РґСѓР±Р»РёРєР°С‚РѕРІ: ${removedCount}`);
    console.log(`вњ— РћС€РёР±РѕРє РїСЂРё СѓРґР°Р»РµРЅРёРё: ${results.filter(r => !r.success).length}`);

    return {
      success: true,
      duplicatesFound: totalDuplicates,
      duplicatesRemoved: removedCount,
      results: results,
      message: `РЈРґР°Р»РµРЅРѕ ${removedCount} РґСѓР±Р»РёРєР°С‚РѕРІ РёР· ${totalDuplicates} РЅР°Р№РґРµРЅРЅС‹С…`
    };
  } catch (error) {
    console.error('РљСЂРёС‚РёС‡РµСЃРєР°СЏ РѕС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё РґСѓР±Р»РёРєР°С‚РѕРІ:', error);
    throw error;
  }
};

// Р”РµР»Р°РµРј С„СѓРЅРєС†РёСЋ РґРѕСЃС‚СѓРїРЅРѕР№ РІ РєРѕРЅСЃРѕР»Рё Р±СЂР°СѓР·РµСЂР°
if (typeof window !== 'undefined') {
  window.removeDuplicateMovies = removeDuplicateMovies;
  console.log('Р¤СѓРЅРєС†РёСЏ removeDuplicateMovies() РґРѕСЃС‚СѓРїРЅР° РІ РєРѕРЅСЃРѕР»Рё. Р’С‹Р·РѕРІРёС‚Рµ РµС‘ РґР»СЏ СѓРґР°Р»РµРЅРёСЏ РґСѓР±Р»РёРєР°С‚РѕРІ.');
}

