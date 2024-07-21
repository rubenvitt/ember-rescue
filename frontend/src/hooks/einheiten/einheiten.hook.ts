import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EinheitDto, EinheitTypDto } from '../../types/types.js';
import { backendFetch } from '../../utils/http.js';
import { useEinsatz } from '../einsatz.hook.js';
import { useMemo } from 'react';

export function useEinheiten(props?: { einheitId?: string }) {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();
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
    mutationKey: ['einsatz-einheiten', 'add', einsatzId],
    mutationFn: ({ einheitId }) => {
      console.log('Add einheit to einsatz', einheitId, einsatzId);
      return backendFetch(`/einsatz/${einsatzId}/einheiten/add`, {
        body: JSON.stringify({
          einheitId,
        }),
        method: 'POST',
      });
    },
  });

  const removeEinheitFromEinsatz = useMutation<unknown, unknown, {}>({
    mutationKey: ['einheiten'],
    mutationFn: async () => {
      if (!props?.einheitId) {
        return Promise.reject(new Error('einheitId ist erforderlich'));
      }
      console.log('Remove einheit', props.einheitId);
      await backendFetch(`/einsatz/${einsatzId}/einheiten/${props.einheitId}`, {
        method: 'DELETE',
      });
      await queryClient.invalidateQueries({
        queryKey: ['einheiten'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['einheiten', props.einheitId],
      });
    },
  });

  const changeStatus = useMutation<unknown, unknown, { statusId: string }>({
    mutationKey: ['einheit', props?.einheitId, 'status'],
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['einheiten'] }),
    mutationFn: ({ statusId }) => {
      if (!props?.einheitId) {
        return Promise.reject(new Error('einheitId ist erforderlich'));
      }
      return backendFetch(`/einsatz/${einsatzId}/einheiten/${props.einheitId}/status`, {
        body: JSON.stringify({
          statusId,
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
    removeEinheitFromEinsatz,
    einheitenNichtImEinsatz,
    changeStatus,
  };
}