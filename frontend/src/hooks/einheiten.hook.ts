import { useQuery } from '@tanstack/react-query';
import { EinheitDto } from '../types.js';
import { backendFetch } from '../lib/http.js';

export function useEinheiten({ einsatzId }: { einsatzId?: string } = {}) {
  const { data: einheiten, isLoading, isFetched } = useQuery<EinheitDto[]>({
    queryKey: ['einheiten'],
    queryFn: async () => backendFetch('/einheiten'),
  });

  return { einheiten: { data: einsatzId ? [] : einheiten, isLoading, isFetched } };
}