import { useEffect, useState } from 'react';
import { doramasService } from '../Backend/database';

export function useDoramas() {
  const [doramas, setDoramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDoramas = async () => {
      try {
        const data = await doramasService.getAll();
        if (isMounted) {
          setDoramas(data);
        }
      } catch (err) {
        console.error('РћС€РёР±РєР° РїРѕР»СѓС‡РµРЅРёСЏ РґРѕСЂР°Рј:', err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDoramas();

    return () => {
      isMounted = false;
    };
  }, []);

  return { doramas, loading, error };
}

