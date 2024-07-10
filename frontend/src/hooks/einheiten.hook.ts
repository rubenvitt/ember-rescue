import { useMutation, useQuery } from '@tanstack/react-query';
import { EinheitDto, EinheitTypDto } from '../types.js';
import { backendFetch } from '../lib/http.js';

export function useEinheiten({ einsatzId }: { einsatzId?: string | null } = {}) {
  const { data: einheiten, isLoading, isFetched, refetch } = useQuery<EinheitDto[]>({
    queryKey: ['einheiten'],
    queryFn: async () => backendFetch('/einheiten'),
  });
  const einheitenTypen = useQuery<EinheitTypDto[]>({
    queryKey: ['einheiten-typen'],
    queryFn: async () => backendFetch('/einheiten/typen'),
  });

  const patchEinheiten = useMutation<unknown, unknown, (Omit<EinheitDto, '_count' | 'status' | 'einheitTyp' | 'id'> & Partial<Pick<EinheitDto, 'id'>> & {
    einheitTypId: string
  })[]>({
    mutationKey: ['einheiten'],
    mutationFn: (einheiten) => backendFetch('/einheiten', {
      method: 'PATCH',
      body: JSON.stringify(einheiten),
    }),
    onSuccess: async () => {
      await refetch();
    },
  });

  return { einheiten: { data: einsatzId ? [] : einheiten, isLoading, isFetched }, einheitenTypen, patchEinheiten };
}