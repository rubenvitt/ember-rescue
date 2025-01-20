import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { AddVehicleToMissionDto, ChangeStatusDto, EinsatzFahrzeugeApi, ImportManyFahrzeugeDto, VehiclesApi } from '@bluelight-hub/shared/client/index.js';

export const queryKey = 'fahrzeuge';

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const templateApi = new VehiclesApi(getAPIConfig());
const einsatzFahrzeugeApi = new EinsatzFahrzeugeApi(getAPIConfig());

/// fetch

export const fetchAllFahrzeuge = {
  queryKey: ({ missionId }: { missionId: string | null }) => [queryKey, missionId],
  queryFn: ({ missionId }: { missionId: string | null }) =>
    function () {
      if (!missionId) {
        throw new Error('No missionId found in local storage. Please login and select a mission before fetching fahrzeuge.');
      }
      return einsatzFahrzeugeApi.einsatzFahrzeugeControllerFindFahrzeugeImEinsatzV1({
        einsatzId: missionId,
      });
    },
};

export const fetchAllFahrzeugeJson = {
  queryKey: [queryKey, 'json'],
  queryFn: async function () {
    return JSON.stringify((await templateApi.vehiclesControllerFindAllV1()).data, undefined, 2);
  },
};

export let fetchAllTemplateFahrzeuge = {
  queryKey: [queryKey, 'template'],
  queryFn: async function () {
    return templateApi.vehiclesControllerFindAllV1();
  },
};

export const postAddFahrzeugToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn:
    ({ einsatzId }: { einsatzId: string | null }) =>
      async (dto: AddVehicleToMissionDto) => {
        // fixme: something not working here. fullOpta is... undefined
        console.log('Add fahrzeug to einsatz', dto.fullOpta, einsatzId);
        if (!einsatzId) {
          throw new Error('No einsatzId found in local storage. Please login and select a mission before fetching einsatzfahrzeuge.');
        }

        return einsatzFahrzeugeApi.einsatzFahrzeugeControllerAddFahrzeugToEinsatzV1({
          einsatzId: einsatzId,
          addVehicleToMissionDto: dto,
        });
      },
};

export const fetchFahrzeugTypen = {
  queryKey: [queryKey, 'typen'],
  queryFn: function () {
    return templateApi.vehiclesControllerFindAllTypenV1();
  },
};

// mutate

export const deleteFahrzeugFromEinsatz = {
  mutationKey: ({ einsatzId, fullOpta }: { einsatzId: unknown; fullOpta: unknown }) => [queryKey, einsatzId, fullOpta, 'remove'],
  mutationFn: ({ fullOpta, einsatzId }: { fullOpta?: string; einsatzId: string | null }) =>
    async function () {
      if (!einsatzId || !fullOpta) {
        throw new Error('No einsatzId or fullOpta given. Please provide both.');
      }
      console.log('Remove fahrzeug from einsatz', fullOpta, einsatzId);

      return einsatzFahrzeugeApi.einsatzFahrzeugeControllerRemoveFromEinsatzV1({
        einsatzId: einsatzId,
        fullOpta: fullOpta,
      });
    },
};
export const postStatusForFahrzeug = {
  mutationKey: (props: { einsatzId: unknown; fahrzeuggId: unknown }) => [queryKey, ...[Object.values(props)], 'status'],
  mutationFn:
    ({ fullOpta, einsatzId }: { fullOpta?: string; einsatzId?: string | null }) =>
      async (changeStatusDto: ChangeStatusDto) => {
        if (!einsatzId || !fullOpta) {
          throw new Error('No einsatzId or fullOpta given. Please provide both.');
        }

        console.log('Change status for fahrzeug', fullOpta, einsatzId, changeStatusDto);

        return einsatzFahrzeugeApi.einsatzFahrzeugeControllerChangeStatusV1({
          einsatzId: einsatzId,
          fullOpta: fullOpta,
          changeStatusDto
        });
      },
};

export const postAllFahrzeugeJson = {
  queryKey: [queryKey, 'json'],
  mutationFn: async ({ json }: { json: string }) => {
    return templateApi.vehiclesControllerImportFahrzeugeV1({
      importManyFahrzeugeDto: JSON.parse(json),
    });
  },
};

export const patchFahrzeuge = {
  mutationKey: [queryKey, 'patch'],
  mutationFn: async (fahrzeuge: ImportManyFahrzeugeDto) => {
    return await templateApi.vehiclesControllerUpdateManyV1({
      importManyFahrzeugeDto: fahrzeuge,
    });
  },
};
export const removeVehicleTemplate = {
  mutationKey: [queryKey, 'remove'],
  mutationFn: async (vehicleId: string) => {
    return await templateApi.vehiclesControllerDeleteVehicleV1({
      vehicleId,
    });
  },
};
