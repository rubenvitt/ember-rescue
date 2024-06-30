import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EinsatztagebuchEintrag } from '../types.js';
import { backendFetch } from '../lib/http.js';

export function useEinsatztagebuch() {
  const queryClient = useQueryClient();
  const { data } = useQuery<EinsatztagebuchEintrag[]>({
    queryKey: ['einsatztagebuch'],
    queryFn: async () => {
      return await backendFetch('/einsatztagebuch');
    },
  });

  const { mutate } = useMutation({
    mutationKey: ['einsatztagebuch'],
    mutationFn: async () => {
      console.log('mutate');
      return await backendFetch('/einsatztagebuch', {
        method: 'POST',
        //body: JSON.stringify(einsatztagebuchEintrag),
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
    createEinsatztagebuchEintrag: async () => {
      console.log('createEinsatztagebuchEintrag');
      return mutate();
    },
  };
}