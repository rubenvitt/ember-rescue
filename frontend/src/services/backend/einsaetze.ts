import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { CreateMissionDto, MissionCoreApi, SmallMissionDto, UpdateMissionDto } from '@bluelight-hub/shared/client/index.js';

// Export des queryKey
export const queryKey = 'mission';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey, 'offeneEinsaetze'], queryClient);

const api = new MissionCoreApi(getAPIConfig());

// GET Single Einsatz
export const fetchSingleEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: function ({ einsatzId }: { einsatzId: string | null }) {
    if (!einsatzId) return Promise.reject();

    return api.missionCoreControllerGetMissionV1({
      id: einsatzId,
    });
  },
};

// GET All offene Einsätze
export const fetchOffeneEinsaetze = {
  queryKey: [queryKey, 'offeneEinsaetze'],
  queryFn: function () {
    return api.missionCoreControllerGetMissionsV1({
      abgeschlossen: false,
    });
  },
};

// POST New Einsatz
export const createEinsatz = {
  mutationKey: [queryKey, 'add'],
  mutationFn: async (data: CreateMissionDto) => {
    return api.missionCoreControllerCreateEinsatzV1({
      createMissionDto: data,
    });
  },
};

// PUT Existing Einsatz
export const updateEinsatz = {
  mutationKey: [queryKey, 'update'],
  mutationFn: async ({ id, data }: { id: string; data: UpdateMissionDto }) => {
    return api.missionCoreControllerChangeEinsatzV1({
      id,
      updateMissionDto: data,
    });
  },
};

// PUT Abschluss eines Einsatzes
export const einsatzAbschliessen = {
  mutationKey: ({ missionId }: { missionId: string | null }) => [queryKey, missionId, 'close'],
  mutationFn: async (einsatz: SmallMissionDto) => {
    return api.missionCoreControllerCloseEinsatzV1({
      id: einsatz.id,
    });
  },
};
