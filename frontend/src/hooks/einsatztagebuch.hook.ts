import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EinsatztagebuchEintrag } from '../types.js';
import { backendFetch } from '../lib/http.js';
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

  const createEinsatztagebuchEintrag = useMutation<EinsatztagebuchEintrag, unknown, Omit<EinsatztagebuchEintrag, 'id' | 'bearbeiter'>>({
    mutationKey: ['einsatztagebuch'],
    mutationFn: async (einsatztagebuchEintrag) => {
      console.log('mutate');
      return await backendFetch('/einsatztagebuch', {
        method: 'POST',
        body: JSON.stringify(einsatztagebuchEintrag),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['einsatztagebuch'] });
    },
  });

  return {
    einsatztagebuch: data,
    createEinsatztagebuchEintrag,
  };
}