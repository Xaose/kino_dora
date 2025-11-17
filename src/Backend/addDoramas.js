import { doramasService } from './database';
import { getCurrentUser } from './authService';

// РњР°СЃСЃРёРІ РґРѕСЂР°Рј СЃ Р·Р°РїРѕР»РЅРµРЅРЅС‹РјРё РїРѕР»СЏРјРё (РІРєР»СЋС‡Р°СЏ СЃРµР·РѕРЅС‹ Рё СЃРµСЂРёРё)
const newDoramas = [
  {
    title: 'РРіСЂР° РІ РєР°Р»СЊРјР°СЂР°',
    description: 'РЎРѕС‚РЅРё РёРіСЂРѕРєРѕРІ СЃ РЅРёР·РєРёРј РґРѕС…РѕРґРѕРј РїРѕР»СѓС‡Р°СЋС‚ РїСЂРёРіР»Р°С€РµРЅРёРµ РїСЂРёРЅСЏС‚СЊ СѓС‡Р°СЃС‚РёРµ РІ РґРµС‚СЃРєРёС… РёРіСЂР°С… СЃ Р·Р°РјР°РЅС‡РёРІС‹Рј РїСЂРёР·РѕРј РІ 45,6 РјРёР»Р»РёР°СЂРґР° РІРѕРЅ. РћРЅРё СЂРёСЃРєСѓСЋС‚ Р¶РёР·РЅСЊСЋ, С‡С‚РѕР±С‹ СЃС‚Р°С‚СЊ РµРґРёРЅСЃС‚РІРµРЅРЅС‹Рј РїРѕР±РµРґРёС‚РµР»РµРј.',
    director: 'РҐРІР°РЅ Р”РѕРЅ РҐС‘Рє',
    genres: ['РўСЂРёР»Р»РµСЂ', 'Р”СЂР°РјР°', 'Р­РєС€РЅ'],
    actors: ['Р›Рё Р§РѕРЅ Р”Р¶СЌ', 'РџР°Рє РҐСЌ РЎСѓ', 'Рћ РЃРЅ РЎСѓ', 'РҐРѕ РЎРѕРЅ РўС…СЌ'],
    ageRating: 18,
    releaseYear: 2021,
    runtime: '60 РјРёРЅ',
    budget: 21400000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    movie: 'https://www.youtube.com/watch?v=oqxAJKy0ii4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'РЎРµР·РѕРЅ 1',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'РљСЂР°СЃРЅС‹Р№ СЃРІРµС‚, Р·РµР»РµРЅС‹Р№ СЃРІРµС‚',
            description: 'РЎРѕРЅ Р“Рё РҐСѓРЅ РїРѕР»СѓС‡Р°РµС‚ Р·Р°РіР°РґРѕС‡РЅРѕРµ РїСЂРёРіР»Р°С€РµРЅРёРµ РїСЂРёРЅСЏС‚СЊ СѓС‡Р°СЃС‚РёРµ РІ РёРіСЂРµ.',
            runtime: '60 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4'
          },
          {
            episodeNumber: 2,
            title: 'РђРґ',
            description: 'РРіСЂРѕРєРё РїРѕРЅРёРјР°СЋС‚, С‡С‚Рѕ РїСЂРѕРёРіСЂС‹С€ РѕР·РЅР°С‡Р°РµС‚ СЃРјРµСЂС‚СЊ.',
            runtime: '60 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=oqxAJKy0ii4'
          }
        ]
      }
    ],
    episodes: [] // РћР±С‰РёРµ СЌРїРёР·РѕРґС‹ (РµСЃР»Рё РЅРµ РїСЂРёРІСЏР·Р°РЅС‹ Рє СЃРµР·РѕРЅР°Рј)
  },
  {
    title: 'РџР°СЂР°Р·РёС‚С‹',
    description: 'РСЃС‚РѕСЂРёСЏ Рѕ СЃРµРјСЊРµ РљРё РўС…СЌРєР°, РєРѕС‚РѕСЂР°СЏ РїРѕСЃС‚РµРїРµРЅРЅРѕ РїСЂРѕРЅРёРєР°РµС‚ РІ РґРѕРј Р±РѕРіР°С‚РѕР№ СЃРµРјСЊРё РџР°Рє, РёСЃРїРѕР»СЊР·СѓСЏ С…РёС‚СЂРѕСЃС‚СЊ Рё РѕР±РјР°РЅ.',
    director: 'РџРѕРЅ Р§Р¶СѓРЅ РҐРѕ',
    genres: ['РўСЂРёР»Р»РµСЂ', 'Р”СЂР°РјР°', 'РљРѕРјРµРґРёСЏ'],
    actors: ['РЎРѕРЅ РљР°РЅ РҐРѕ', 'Р›Рё РЎРѕРЅ Р“СЋРЅ', 'Р§Рѕ РЃ Р§РѕРЅ', 'Р§С…РІРµ РЈ РЎРёРє'],
    ageRating: 16,
    releaseYear: 2019,
    runtime: '132 РјРёРЅ',
    budget: 11000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    movie: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    seasons: [],
    episodes: [
      {
        episodeNumber: 1,
        title: 'Р­РїРёР·РѕРґ 1',
        description: 'РЎРµРјСЊСЏ РљРё РўС…СЌРєР° РЅР°С‡РёРЅР°РµС‚ СЃРІРѕР№ РїР»Р°РЅ.',
        runtime: '132 РјРёРЅ',
        videoUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY'
      }
    ]
  },
  {
    title: 'РљРѕСЂРѕР»СЊ: Р’РµС‡РЅС‹Р№ РјРѕРЅР°СЂС…',
    description: 'РљРѕСЂРµР№СЃРєРёР№ РёРјРїРµСЂР°С‚РѕСЂ РїС‹С‚Р°РµС‚СЃСЏ Р·Р°РєСЂС‹С‚СЊ РїРѕСЂС‚Р°Р» РјРµР¶РґСѓ РґРІСѓРјСЏ РјРёСЂР°РјРё Рё РІСЃС‚СЂРµС‡Р°РµС‚ РґРµС‚РµРєС‚РёРІР° РёР· СЃРѕРІСЂРµРјРµРЅРЅРѕР№ РљРѕСЂРµРё.',
    director: 'Р‘СЌРє РЎР°РЅ РҐСѓРЅ',
    genres: ['Р¤Р°РЅС‚Р°СЃС‚РёРєР°', 'Р РѕРјР°РЅС‚РёРєР°', 'Р”СЂР°РјР°'],
    actors: ['Р›Рё РњРёРЅ РҐРѕ', 'РљРёРј Р“Рѕ Р«РЅ', 'РЈ Р”Рѕ РҐРІР°РЅ', 'Р§РѕРЅ Р«РЅ Р§СЌ'],
    ageRating: 12,
    releaseYear: 2020,
    runtime: '70 РјРёРЅ',
    budget: 30000000,
    poster: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500',
    trailer: 'https://www.youtube.com/watch?v=G5tzsfN5nwM',
    movie: 'https://www.youtube.com/watch?v=G5tzsfN5nwM',
    seasons: [
      {
        seasonNumber: 1,
        title: 'РЎРµР·РѕРЅ 1',
        releaseYear: 2020,
        episodes: [
          {
            episodeNumber: 1,
            title: 'РљРѕСЂРѕР»СЊ РґРІСѓС… РјРёСЂРѕРІ',
            description: 'РРјРїРµСЂР°С‚РѕСЂ Р›Рё Р“РѕРЅ РїРµСЂРµСЃРµРєР°РµС‚ РїРѕСЂС‚Р°Р» РІ СЃРѕРІСЂРµРјРµРЅРЅСѓСЋ РљРѕСЂРµСЋ.',
            runtime: '70 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          },
          {
            episodeNumber: 2,
            title: 'Р›СѓРЅРЅР°СЏ РєСЂРѕР»РёС†Р°',
            description: 'Р”РµС‚РµРєС‚РёРІ Р§РѕРЅ РўС…СЌ Р РІСЃС‚СЂРµС‡Р°РµС‚ Р·Р°РіР°РґРѕС‡РЅРѕРіРѕ РјСѓР¶С‡РёРЅСѓ.',
            runtime: '70 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          },
          {
            episodeNumber: 3,
            title: 'РўР°Р№РЅР° РїРѕСЂС‚Р°Р»Р°',
            description: 'РўР°Р№РЅР° РїРѕСЂС‚Р°Р»Р° РјРµР¶РґСѓ РјРёСЂР°РјРё СЂР°СЃРєСЂС‹РІР°РµС‚СЃСЏ.',
            runtime: '70 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=G5tzsfN5nwM'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'Р’РёРЅС‡РµРЅС†Рѕ',
    description: 'РљРѕСЂРµР№СЃРєРѕ-РёС‚Р°Р»СЊСЏРЅСЃРєРёР№ РјР°С„РёРѕР·Рё Р’РёРЅС‡РµРЅС†Рѕ РљР°СЃСЃР°РЅРѕ РІРѕР·РІСЂР°С‰Р°РµС‚СЃСЏ РІ РљРѕСЂРµСЋ Рё РІСЃС‚СѓРїР°РµС‚ РІ Р±РёС‚РІСѓ СЃ РєРѕСЂСЂСѓРјРїРёСЂРѕРІР°РЅРЅРѕР№ РєРѕСЂРїРѕСЂР°С†РёРµР№.',
    director: 'РљРёРј РҐРё Р’РѕРЅ',
    genres: ['РљРѕРјРµРґРёСЏ', 'РљСЂРёРјРёРЅР°Р»', 'Р”СЂР°РјР°'],
    actors: ['РЎРѕРЅ Р§Р¶СѓРЅ РљРё', 'Р§РѕРЅ РЃ Р‘РёРЅ', 'РћРє РўС…СЌ РљСЋ', 'РљРёРј РЃ Р”Р¶РёРЅ'],
    ageRating: 16,
    releaseYear: 2021,
    runtime: '80 РјРёРЅ',
    budget: 20000000,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
    trailer: 'https://www.youtube.com/watch?v=S12-4mXCNj4',
    movie: 'https://www.youtube.com/watch?v=S12-4mXCNj4',
    seasons: [
      {
        seasonNumber: 1,
        title: 'РЎРµР·РѕРЅ 1',
        releaseYear: 2021,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Р’РѕР·РІСЂР°С‰РµРЅРёРµ РјР°С„РёРѕР·Рё',
            description: 'Р’РёРЅС‡РµРЅС†Рѕ РІРѕР·РІСЂР°С‰Р°РµС‚СЃСЏ РІ РљРѕСЂРµСЋ.',
            runtime: '80 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=S12-4mXCNj4'
          },
          {
            episodeNumber: 2,
            title: 'Р‘РёС‚РІР° РЅР°С‡РёРЅР°РµС‚СЃСЏ',
            description: 'Р’РёРЅС‡РµРЅС†Рѕ РЅР°С‡РёРЅР°РµС‚ Р±РѕСЂСЊР±Сѓ СЃ РєРѕСЂРїРѕСЂР°С†РёРµР№.',
            runtime: '80 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=S12-4mXCNj4'
          }
        ]
      }
    ],
    episodes: []
  },
  {
    title: 'РҐРёР»РµСЂ',
    description: 'Р РµРїРѕСЂС‚РµСЂ Рё РєСѓСЂСЊРµСЂ СЃ РѕСЃРѕР±С‹РјРё СЃРїРѕСЃРѕР±РЅРѕСЃС‚СЏРјРё СЂР°Р±РѕС‚Р°СЋС‚ РІРјРµСЃС‚Рµ, С‡С‚РѕР±С‹ СЂР°СЃРєСЂС‹С‚СЊ РїСЂР°РІРґСѓ Рѕ РєРѕСЂСЂСѓРїС†РёРё.',
    director: 'РЎРѕРЅ Р§Р¶СѓРЅ РҐРѕ',
    genres: ['Р­РєС€РЅ', 'Р РѕРјР°РЅС‚РёРєР°', 'Р”СЂР°РјР°'],
    actors: ['Р§Рё Р§Р°РЅ РЈРє', 'РџР°Рє РњРёРЅ РЃРЅ', 'Р® Р”Р¶Рё РўС…СЌ', 'РџР°Рє РЎР°РЅ РЈРЅ'],
    ageRating: 12,
    releaseYear: 2014,
    runtime: '60 РјРёРЅ',
    budget: 15000000,
    poster: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=500',
    trailer: 'https://www.youtube.com/watch?v=8X5kEnw3zqI',
    movie: 'https://www.youtube.com/watch?v=8X5kEnw3zqI',
    seasons: [
      {
        seasonNumber: 1,
        title: 'РЎРµР·РѕРЅ 1',
        releaseYear: 2014,
        episodes: [
          {
            episodeNumber: 1,
            title: 'РљСѓСЂСЊРµСЂ',
            description: 'Р—РЅР°РєРѕРјСЃС‚РІРѕ СЃ РіР»Р°РІРЅС‹РјРё РіРµСЂРѕСЏРјРё.',
            runtime: '60 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=8X5kEnw3zqI'
          },
          {
            episodeNumber: 2,
            title: 'РџСЂР°РІРґР°',
            description: 'РќР°С‡Р°Р»Рѕ СЂР°СЃСЃР»РµРґРѕРІР°РЅРёСЏ.',
            runtime: '60 РјРёРЅ',
            videoUrl: 'https://www.youtube.com/watch?v=8X5kEnw3zqI'
          }
        ]
      }
    ],
    episodes: []
  }
];

/**
 * Р”РѕР±Р°РІРёС‚СЊ РґРѕСЂР°РјС‹ РІ Firebase
 * РўСЂРµР±СѓРµС‚ Р°РІС‚РѕСЂРёР·Р°С†РёРё РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ
 */
export const addDoramasToFirebase = async () => {
  try {
    const user = getCurrentUser();
    
    if (!user) {
      console.error('РћС€РёР±РєР°: РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РЅРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ');
      return {
        success: false,
        error: 'РўСЂРµР±СѓРµС‚СЃСЏ Р°РІС‚РѕСЂРёР·Р°С†РёСЏ РґР»СЏ РґРѕР±Р°РІР»РµРЅРёСЏ РґРѕСЂР°Рј'
      };
    }

    console.log(`РќР°С‡РёРЅР°СЋ РґРѕР±Р°РІР»РµРЅРёРµ ${newDoramas.length} РґРѕСЂР°Рј РІ Firebase...`);
    console.log('РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ:', user.email);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const dorama of newDoramas) {
      try {
        const result = await doramasService.add(dorama);
        successCount++;
        results.push({
          success: true,
          title: dorama.title,
          id: result.id
        });
        console.log(`вњ“ Р”РѕР±Р°РІР»РµРЅР° РґРѕСЂР°РјР°: "${dorama.title}"`);
      } catch (error) {
        errorCount++;
        results.push({
          success: false,
          title: dorama.title,
          error: error.message
        });
        console.error(`вњ— РћС€РёР±РєР° РїСЂРё РґРѕР±Р°РІР»РµРЅРёРё "${dorama.title}":`, error);
      }
    }

    console.log(`\n=== Р РµР·СѓР»СЊС‚Р°С‚С‹ ===`);
    console.log(`вњ“ РЈСЃРїРµС€РЅРѕ РґРѕР±Р°РІР»РµРЅРѕ: ${successCount}`);
    console.log(`вњ— РћС€РёР±РѕРє: ${errorCount}`);

    return {
      success: true,
      added: successCount,
      errors: errorCount,
      results
    };
  } catch (error) {
    console.error('РљСЂРёС‚РёС‡РµСЃРєР°СЏ РѕС€РёР±РєР° РїСЂРё РґРѕР±Р°РІР»РµРЅРёРё РґРѕСЂР°Рј:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

