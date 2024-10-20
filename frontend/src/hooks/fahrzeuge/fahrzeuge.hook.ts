import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEinsatz } from '../einsatz.hook.js';
import { useMemo } from 'react';
import { PatchFahrzeugeType } from '../../services/backend/fahrzeuge.js';
import { services } from '../../services/index.js';
import { FahrzeugDto, FahrzeugTypDto } from '../../types/app/fahrzeug.types.js';

export function useFahrzeuge(props?: { fahrzeugId?: string }) {
  const queryClient = useQueryClient();
  const { einsatzId } = useEinsatz();
  const fahrzeuge = useQuery<FahrzeugDto[]>({
    queryKey: services.backend.fahrzeuge.fetchAllFahrzeuge.queryKey,
    queryFn: services.backend.fahrzeuge.fetchAllFahrzeuge.queryFn,
  });
  const fahrzeugeImEinsatz = useQuery<FahrzeugDto[]>({
    queryKey: services.backend.fahrzeuge.fetchAllFahrzeugeImEinsatz.queryKey({ einsatzId }),
    queryFn: services.backend.fahrzeuge.fetchAllFahrzeugeImEinsatz.queryFn({ einsatzId }),
    enabled: Boolean(einsatzId),
  });

  const fahrzeugeNichtImEinsatz = useMemo(() => {
    if (!fahrzeuge.data || !fahrzeugeImEinsatz.data) {
      return [];
    }
    const einsatzFahrzeugeIds = new Set(fahrzeugeImEinsatz.data.map((fahrzeug) => fahrzeug.id));
    return fahrzeuge.data.filter((fahrzeug) => !einsatzFahrzeugeIds.has(fahrzeug.id));
  }, [fahrzeuge, fahrzeugeImEinsatz]);

  const fahrzeugeTypen = useQuery<FahrzeugTypDto[]>({
    queryKey: services.backend.fahrzeuge.fetchFahrzeugTypen.queryKey,
    queryFn: services.backend.fahrzeuge.fetchFahrzeugTypen.queryFn,
  });

  const patchFahrzeuge = useMutation<unknown, unknown, PatchFahrzeugeType>({
    mutationKey: services.backend.fahrzeuge.patchFahrzeuge.mutationKey,
    mutationFn: services.backend.fahrzeuge.patchFahrzeuge.mutationFn,
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const addFahrzeugToEinsatz = useMutation<unknown, unknown, { fahrzeugId: string }>({
    mutationKey: services.backend.fahrzeuge.postAddFahrzeugToEinsatz.mutationKey({ einsatzId }),
    mutationFn: services.backend.fahrzeuge.postAddFahrzeugToEinsatz.mutationFn({ einsatzId }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const removeFahrzeugFromEinsatz = useMutation<unknown, unknown, {}>({
    mutationKey: services.backend.fahrzeuge.deleteFahrzeugFromEinsatz.mutationKey({
      einsatzId,
      fahrzeugId: props?.fahrzeugId,
    }),
    mutationFn: services.backend.fahrzeuge.deleteFahrzeugFromEinsatz.mutationFn({
      fahrzeugId: props?.fahrzeugId,
      einsatzId,
    }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const changeStatus = useMutation<unknown, unknown, { statusId: string }>({
    mutationKey: services.backend.fahrzeuge.postStatusForFahrzeug.mutationKey({
      einsatzId,
      fahrzeuggId: props?.fahrzeugId,
    }),
    mutationFn: services.backend.fahrzeuge.postStatusForFahrzeug.mutationFn({
      einsatzId,
      fahrzeugId: props?.fahrzeugId,
    }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  return {
    fahrzeuge,
    fahrzeugeImEinsatz,
    fahrzeugeTypen,
    patchFahrzeuge,
    addFahrzeugToEinsatz,
    removeFahrzeugFromEinsatz,
    fahrzeugeNichtImEinsatz,
    changeStatus,
  };
}
