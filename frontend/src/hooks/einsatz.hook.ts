import { useMutation, useQuery } from '@tanstack/react-query';
import { useStore } from './store.hook.js';
import { services } from '../services/index.js';
import { CreateEinsatz, Einsatz } from '../types/app/einsatz.types.js';

export function useEinsatz() {
  const { setEinsatz, einsatzId, removeEinsatz } = useStore();

  const singleEinsatz = useQuery<Einsatz | null>({
    queryKey: services.backend.einsatze.fetchSingleEinsatz.queryKey({ einsatzId }),
    queryFn: async () => {
      return services.backend.einsatze.fetchSingleEinsatz.queryFn({ einsatzId }).catch(() => {
        removeEinsatz();
        return null;
      });
    },
    enabled: !!einsatzId,
  });

  const offeneEinsaetze = useQuery<Einsatz[]>({
    queryKey: services.backend.einsatze.fetchOffeneEinsaetze.queryKey,
    queryFn: services.backend.einsatze.fetchOffeneEinsaetze.queryFn,
  });

  const createEinsatz = useMutation<Einsatz, unknown, CreateEinsatz>({
    mutationKey: services.backend.einsatze.createEinsatz.mutationKey,
    mutationFn: services.backend.einsatze.createEinsatz.mutationFn,
    onSuccess: services.backend.einsatze.invalidateQueries,
  });

  const einsatzAbschliessen = useMutation<unknown, unknown, Einsatz>({
    mutationKey: services.backend.einsatze.einsatzAbschliessen.mutationKey({ einsatzId }),
    mutationFn: services.backend.einsatze.einsatzAbschliessen.mutationFn,
    onSuccess: services.backend.einsatze.invalidateQueries,
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