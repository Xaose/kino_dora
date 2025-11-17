import { useEffect, useState } from 'react';
import { moviesService } from '../Backend/database';

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovies = async () => {
      try {
        const data = await moviesService.getAll();
        if (isMounted) {
          setMovies(data);
        }
      } catch (err) {
        console.error('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ С„РёР»СЊРјРѕРІ:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  return { movies, loading, error };
}

