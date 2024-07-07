import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { backendFetch } from '../lib/http.js';
import { Einsatz } from '../types.js';
import { useStore } from './store.hook.js';

export function useEinsatz() {
  const { setEinsatz, einsatzId, removeEinsatz } = useStore();
  const queryClient = useQueryClient();

  const singleEinsatz = useQuery<Einsatz>({
    queryKey: ['einsatz', einsatzId],
    queryFn: async () => {
      return backendFetch(`/einsatz/${einsatzId}`).catch(() => {
        removeEinsatz();
      });
    },
    enabled: !!einsatzId,
  });

  const offeneEinsaetze = useQuery<Einsatz[]>({
    queryKey: ['offeneEinsaetze'],
    queryFn: async () => {
      return backendFetch('/einsatz?abgeschlossen=false');
    },
  });

  const createEinsatz = useMutation<Einsatz, unknown, unknown>({
    mutationFn: async (data: unknown) => {
      return backendFetch('/einsatz', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  const einsatzAbschliessen = useMutation<unknown, unknown, Einsatz>({
    mutationKey: ['offeneEinsaetze'],
    mutationFn: async (einsatz) =>
      await backendFetch(`/einsatz/${einsatz.id}/close`, {
        method: 'PUT',
      }).then(() => queryClient.invalidateQueries({ queryKey: ['offeneEinsaetze'] })),
  });

  function saveEinsatz(einsatz: Einsatz) {
    setEinsatz(einsatz);
  }

  return {
    einsatz: { ...singleEinsatz, isDisabled: !einsatzId },
    saveEinsatz,
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
    einsatzAbschliessen: {
      isPending: einsatzAbschliessen.isPending,
      isSuccess: einsatzAbschliessen.isSuccess,
      isError: einsatzAbschliessen.isError,
      mutate: einsatzAbschliessen.mutate,
      mutateAsync: einsatzAbschliessen.mutateAsync,
    },
  };
}