import { useMutation, useQuery } from '@tanstack/react-query';
import { EinheitDto, EinheitTypDto } from '../types.js';
import { backendFetch } from '../lib/http.js';
import { useEinsatz } from './einsatz.hook.js';
import { useMemo } from 'react';

export function useEinheiten({ einsatzId }: { einsatzId?: string | null } = {}) {
  const { einsatzId: currentEinsatzId } = useEinsatz();
  const einheiten = useQuery<EinheitDto[]>({
    queryKey: ['einheiten'],
    queryFn: async () => backendFetch('/einheiten'),
  });
  const einheitenImEinsatz = useQuery<EinheitDto[]>({
    queryKey: ['einheiten', einsatzId],
    queryFn: () => backendFetch(`/einsatz/${einsatzId}/einheiten`),
    enabled: Boolean(einsatzId),
  });

  const einheitenNichtImEinsatz = useMemo(() => {
    if (!einheiten.data || !einheitenImEinsatz.data) {
      return [];
    }
    const einsatzEinheitenIds = new Set(einheitenImEinsatz.data.map(einheit => einheit.id));
    return einheiten.data.filter(einheit => !einsatzEinheitenIds.has(einheit.id));
  }, [einheiten, einheitenImEinsatz]);

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
      await einheiten.refetch();
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
    einheiten,
    einheitenImEinsatz,
    einheitenTypen,
    patchEinheiten,
    addEinheitToEinsatz,
    einheitenNichtImEinsatz,
  };
}