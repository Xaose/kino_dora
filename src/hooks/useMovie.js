import { useEffect, useState } from 'react';
import { moviesService } from '../Backend/database';

export function useMovie(movieId) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(Boolean(movieId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!movieId) {
      setMovie(null);
      setLoading(false);
      return;
    }

    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await moviesService.getById(movieId);
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        console.error('Ошибка получения фильма:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovie();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  return { movie, loading, error };
}








