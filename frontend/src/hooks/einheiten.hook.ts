import { useMutation, useQuery } from '@tanstack/react-query';
import { EinheitDto, EinheitTypDto } from '../types.js';
import { backendFetch } from '../lib/http.js';
import { useEinsatz } from './einsatz.hook.js';

export function useEinheiten({ einsatzId }: { einsatzId?: string | null } = {}) {
  const { einsatzId: currentEinsatzId } = useEinsatz();
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

  const addEinheitToEinsatz = useMutation<unknown, unknown, { einheitId: string }>({
    mutationKey: ['einsatz-einheiten', 'add', currentEinsatzId],
    mutationFn: ({ einheitId }) => {
      console.log('Add einheit to einsatz', einheitId, currentEinsatzId);
      return backendFetch(`/einsatz/${currentEinsatzId}/einheiten/add`, {
        body: JSON.stringify({
          einheitId,
        }),
        method: 'POST',
      });
    },
  });

  return {
    einheiten: { data: einsatzId ? [] : einheiten, isLoading, isFetched },
    einheitenTypen,
    patchEinheiten,
    addEinheitToEinsatz,
  };
}