import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EinsatztagebuchEintrag } from '../types.js';
import { fetch } from '@tauri-apps/plugin-http';

export function useEinsatztagebuch() {
  const queryClient = useQueryClient();
  const { data } = useQuery<EinsatztagebuchEintrag[]>({
    queryKey: ['einsatztagebuch'],
    queryFn: async () => {
      return await fetch('http://localhost:3000/einsatztagebuch').then((res) => {
        return res.json();
      });
    },
  });

  const { mutate } = useMutation({
    mutationKey: ['einsatztagebuch'],
    mutationFn: async () => {
      console.log('mutate');
      return await fetch('http://localhost:3000/einsatztagebuch', {
        method: 'POST',
        //body: JSON.stringify(einsatztagebuchEintrag),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
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