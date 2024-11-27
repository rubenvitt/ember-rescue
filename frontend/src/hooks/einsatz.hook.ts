import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from './store.hook.js';
import { services } from '../services/index.js';
import {
  CreateMissionDto,
  ManyMissionsResponse,
  MissionDto,
  SmallMissionDto,
  UpdateMissionDto,
} from '@ember-rescue/shared/client/index.js';

export function useEinsatz() {
  const queryClient = useQueryClient();
  const { setEinsatz, einsatzId, removeEinsatz } = useStore();

  const singleEinsatz = useQuery<MissionDto | null>({
    queryKey: services.backend.einsatze.fetchSingleEinsatz.queryKey({ einsatzId }),
    queryFn: async () => {
      return services.backend.einsatze.fetchSingleEinsatz
        .queryFn({ einsatzId })
        .then((einsatz) => einsatz.data ?? Promise.reject())
        .catch(() => {
          removeEinsatz();
          return null;
        });
    },
    enabled: !!einsatzId,
  });

  const offeneEinsaetze = useQuery<ManyMissionsResponse>({
    queryKey: services.backend.einsatze.fetchOffeneEinsaetze.queryKey,
    queryFn: services.backend.einsatze.fetchOffeneEinsaetze.queryFn,
  });

  const createEinsatz = useMutation<MissionDto, unknown, CreateMissionDto>({
    mutationKey: services.backend.einsatze.createEinsatz.mutationKey,
    mutationFn: async (options) => {
      const einsatz = await services.backend.einsatze.createEinsatz.mutationFn(options);
      if (!einsatz.data) {
        throw new Error('Failed to create mission');
      }
      return einsatz.data;
    },
    onSuccess: services.backend.einsatze.invalidateQueries(queryClient),
  });

  const updateEinsatz = useMutation<MissionDto, unknown, { id: string; data: UpdateMissionDto }>({
    mutationKey: services.backend.einsatze.updateEinsatz.mutationKey,
    mutationFn: async (options) => {
      const einsatz = await services.backend.einsatze.updateEinsatz.mutationFn(options);
      if (!einsatz.data) {
        throw new Error('Failed to update mission');
      }
      return einsatz.data;
    },
    onSuccess: services.backend.einsatze.invalidateQueries(queryClient),
  });

  const einsatzAbschliessen = useMutation<unknown, unknown, SmallMissionDto>({
    mutationKey: services.backend.einsatze.einsatzAbschliessen.mutationKey({ einsatzId }),
    mutationFn: services.backend.einsatze.einsatzAbschliessen.mutationFn,
    onSuccess: services.backend.einsatze.invalidateQueries(queryClient),
  });

  function saveEinsatz(einsatz: SmallMissionDto) {
    setEinsatz(einsatz);
  }

  return {
    einsatzId,
    einsatz: { ...singleEinsatz, isDisabled: !einsatzId },
    saveEinsatz,
    createEinsatz,
    updateEinsatz,
    offeneEinsaetze,
    einsatzAbschliessen,
  };
}
