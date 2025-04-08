import { useState, useEffect } from 'react';
import { totemService } from '@/services/firebase';
import { Totem } from '@/types';

export function useTotem(id: string) {
  const [totem, setTotem] = useState<Totem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchTotem() {
      try {
        const data = await totemService.getById(id);
        setTotem(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar totem'));
      } finally {
        setLoading(false);
      }
    }

    fetchTotem();
  }, [id]);

  return { totem, loading, error };
} 