import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateEinsatztagebuchEintrag, EinsatztagebuchEintrag } from '../types/types.js';
import { backendFetch } from '../utils/http.js';
import { useStore } from './store.hook.js';

export function useEinsatztagebuch() {
  const queryClient = useQueryClient();
  const { einsatzId } = useStore();
  const { data } = useQuery<EinsatztagebuchEintrag[]>({
    queryKey: ['einsatztagebuch', einsatzId],
    queryFn: async () => {
      return await backendFetch('/einsatztagebuch');
    },
  });

  const createEinsatztagebuchEintrag = useMutation<EinsatztagebuchEintrag, unknown, CreateEinsatztagebuchEintrag>({
    mutationKey: ['einsatztagebuch'],
    mutationFn: async (einsatztagebuchEintrag) => {
      return await backendFetch<EinsatztagebuchEintrag>('/einsatztagebuch', {
        method: 'POST',
        body: JSON.stringify(einsatztagebuchEintrag),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['einsatztagebuch'] });
    },
  });

  const archiveEinsatztagebuchEintrag = useMutation<unknown, unknown, { einsatztagebuchEintragId }>({
    mutationKey: ['einsatztagebuch'],
    mutationFn: async ({ einsatztagebuchEintragId }) => {
      if (!einsatztagebuchEintragId) {
        return Promise.reject(new Error('einsatztagebuchEintragId ist erforderlich'));
      }
      return await backendFetch(`/einsatztagebuch/${einsatztagebuchEintragId}/archive`, {
        method: 'POST',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['einsatztagebuch'],
      });
    },
  });

  return {
    einsatztagebuch: data,
    createEinsatztagebuchEintrag,
    archiveEinsatztagebuchEintrag,
  };
}