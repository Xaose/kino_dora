import { useEffect, useState } from 'react';
import { moviesService, doramasService } from '../Backend/database';

export function useMedia(mediaId, mediaType = 'movie') {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(Boolean(mediaId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!mediaId) {
      setMedia(null);
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      setError(null);
      try {
        const service = mediaType === 'dorama' ? doramasService : moviesService;
        const data = await service.getById(mediaId);
        if (isMounted) {
          setMedia(data);
        }
      } catch (err) {
        console.error(`Ошибка получения ${mediaType === 'dorama' ? 'дорамы' : 'фильма'}:`, err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      isMounted = false;
    };
  }, [mediaId, mediaType]);

  return { movie: media, media, loading, error };
}

