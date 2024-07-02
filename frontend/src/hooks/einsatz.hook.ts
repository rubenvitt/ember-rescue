import { useMutation, useQuery } from '@tanstack/react-query';
import { backendFetch } from '../lib/http.js';
import { Einsatz } from '../types.js';
import { useStore } from './store.hook.js';

export function useEinsatz() {
  const { setEinsatz, einsatz } = useStore();

  const offeneEinsaetze = useQuery<Einsatz[]>({
    queryKey: ['offeneEinsaetze'],
    queryFn: async () => {
      return backendFetch('/einsatz?abgeschlossen=false');
    },
  });

  const createEinsatz = useMutation<unknown, unknown, unknown>({
    mutationFn: async (data: unknown) => {
      console.log('mutate with data', data);
      return backendFetch('/einsatz', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  function saveEinsatz(einsatz: Einsatz) {
    setEinsatz(einsatz);
  }

  return {
    einsatz, saveEinsatz,
    createEinsatz: {
      isPending: createEinsatz.isPending,
      isSuccess: createEinsatz.isSuccess,
      isError: createEinsatz.isError,
      mutate: createEinsatz.mutate,
      mutateAsync: createEinsatz.mutateAsync,
    },
    offeneEinsaetze: {
      isLoading: offeneEinsaetze.isLoading,
      isFetched: offeneEinsaetze.isFetched,
      data: offeneEinsaetze.data,
    },
  };
}