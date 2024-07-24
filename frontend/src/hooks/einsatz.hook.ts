import { useMutation, useQuery } from '@tanstack/react-query';
import { Einsatz } from '../types/types.js';
import { useStore } from './store.hook.js';
import { services } from '../services/backend/index.js';

export function useEinsatz() {
  const { setEinsatz, einsatzId, removeEinsatz } = useStore();

  const singleEinsatz = useQuery<Einsatz | null>({
    queryKey: services.einsatze.fetchSingleEinsatz.queryKey({ einsatzId }),
    queryFn: async () => {
      return services.einsatze.fetchSingleEinsatz.queryFn({ einsatzId }).catch(() => {
        removeEinsatz();
        return null;
      });
    },
    enabled: !!einsatzId,
  });

  const offeneEinsaetze = useQuery<Einsatz[]>({
    queryKey: services.einsatze.fetchOffeneEinsaetze.queryKey,
    queryFn: services.einsatze.fetchOffeneEinsaetze.queryFn,
  });

  const createEinsatz = useMutation<Einsatz, unknown, Einsatz>({
    mutationKey: services.einsatze.createEinsatz.mutationKey,
    mutationFn: services.einsatze.createEinsatz.mutationFn,
    onSuccess: services.einsatze.invalidateQueries,
  });

  const einsatzAbschliessen = useMutation<unknown, unknown, Einsatz>({
    mutationKey: services.einsatze.einsatzAbschliessen.mutationKey({ einsatzId }),
    mutationFn: services.einsatze.einsatzAbschliessen.mutationFn,
    onSuccess: services.einsatze.invalidateQueries,
  });

  function saveEinsatz(einsatz: Einsatz) {
    setEinsatz(einsatz);
  }

  return {
    einsatzId,
    einsatz: { ...singleEinsatz, isDisabled: !einsatzId },
    saveEinsatz,
    createEinsatz,
    offeneEinsaetze,
    einsatzAbschliessen,
  };
}