import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEinsatz } from '../einsatz.hook.js';
import { services } from '../../services/index.js';
import { AddVehicleToMissionDto, ChangeStatusDto, ImportManyFahrzeugeDto, ManyFahrzeugeTemplateResponse, ManyFahrzeugTypResponse, type VehiclesResponse } from '@ember-rescue/shared/client/index.js';

export function useFahrzeuge(props?: { fahrzeugId?: string }) {
  const queryClient = useQueryClient();
  const { missionId } = useEinsatz();
  // TODO: refactor this to use einsatzFahrzeugeController (and rename that). Controller needs to merge active vehicles and controller vehicles
  const fahrzeuge = useQuery<VehiclesResponse>({
    queryKey: services.backend.fahrzeuge.fetchAllFahrzeuge.queryKey({ missionId }),
    queryFn: services.backend.fahrzeuge.fetchAllFahrzeuge.queryFn({ missionId }),
  });
  const fahrzeugeJson = useQuery<string>({
    queryKey: services.backend.fahrzeuge.fetchAllFahrzeugeJson.queryKey,
    queryFn: services.backend.fahrzeuge.fetchAllFahrzeugeJson.queryFn,
  });
  const templateFahrzeuge = useQuery<ManyFahrzeugeTemplateResponse>({
    queryKey: services.backend.fahrzeuge.fetchAllTemplateFahrzeuge.queryKey,
    queryFn: services.backend.fahrzeuge.fetchAllTemplateFahrzeuge.queryFn,
  });

  const fahrzeugeTypen = useQuery<ManyFahrzeugTypResponse>({
    queryKey: services.backend.fahrzeuge.fetchFahrzeugTypen.queryKey,
    queryFn: services.backend.fahrzeuge.fetchFahrzeugTypen.queryFn,
  });

  const patchFahrzeuge = useMutation<unknown, unknown, ImportManyFahrzeugeDto>({
    mutationKey: services.backend.fahrzeuge.patchFahrzeuge.mutationKey,
    mutationFn: services.backend.fahrzeuge.patchFahrzeuge.mutationFn,
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const addFahrzeugToEinsatz = useMutation<unknown, unknown, AddVehicleToMissionDto>({
    mutationKey: services.backend.fahrzeuge.postAddFahrzeugToEinsatz.mutationKey({ einsatzId: missionId }),
    mutationFn: services.backend.fahrzeuge.postAddFahrzeugToEinsatz.mutationFn({ einsatzId: missionId }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const removeFahrzeugFromEinsatz = useMutation<unknown, unknown, {}>({
    mutationKey: services.backend.fahrzeuge.deleteFahrzeugFromEinsatz.mutationKey({
      einsatzId: missionId,
      fahrzeugId: props?.fahrzeugId,
    }),
    mutationFn: services.backend.fahrzeuge.deleteFahrzeugFromEinsatz.mutationFn({
      fahrzeugId: props?.fahrzeugId,
      einsatzId: missionId,
    }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const changeStatus = useMutation<unknown, unknown, ChangeStatusDto>({
    mutationKey: services.backend.fahrzeuge.postStatusForFahrzeug.mutationKey({
      einsatzId: missionId,
      fahrzeuggId: props?.fahrzeugId,
    }),
    mutationFn: services.backend.fahrzeuge.postStatusForFahrzeug.mutationFn({
      einsatzId: missionId,
      fahrzeugId: props?.fahrzeugId,
    }),
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  const updateFahrzeugeJson = useMutation<unknown, unknown, { json: string }>({
    mutationKey: services.backend.fahrzeuge.postAllFahrzeugeJson.queryKey,
    mutationFn: services.backend.fahrzeuge.postAllFahrzeugeJson.mutationFn,
    onSuccess: services.backend.fahrzeuge.invalidateQueries(queryClient),
  });

  return {
    fahrzeuge,
    fahrzeugeJson,
    templateFahrzeuge,
    fahrzeugeTypen,
    patchFahrzeuge,
    addFahrzeugToEinsatz,
    removeFahrzeugFromEinsatz,
    changeStatus,
    updateFahrzeugeJson,
  };
}
