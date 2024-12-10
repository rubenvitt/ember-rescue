import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { FahrzeugDto } from '../../types/app/fahrzeug.types.js';
import { QueryClient } from '@tanstack/react-query';
import { AddVehicleToMissionDto, EinsatzFahrzeugeApi, FahrzeugeApi, ImportManyFahrzeugeDto } from '@bluelight-hub/shared/client/index.js';

export const queryKey = 'fahrzeuge';

export type PatchFahrzeugType = Omit<FahrzeugDto, '_count' | 'status' | 'fahrzeugTyp' | 'id' | 'optaOrt' | 'optaFunktion' | 'optaOrdnung'> & Partial<Pick<FahrzeugDto, 'id'>>;

export type PatchFahrzeugeType = PatchFahrzeugType[];

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const templateApi = new FahrzeugeApi(getAPIConfig());
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
    return JSON.stringify((await templateApi.fahrzeugeControllerFindAllV1()).data, undefined, 2);
  },
};

export let fetchAllTemplateFahrzeuge = {
  queryKey: [queryKey, 'template'],
  queryFn: async function () {
    return templateApi.fahrzeugeControllerFindAllV1();
  },
};

export const postAddFahrzeugToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn:
    ({ einsatzId }: { einsatzId: string | null }) =>
    async (dto: AddVehicleToMissionDto) => {
      console.log('Add fahrzeug to einsatz', dto.vehicleId, einsatzId);
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
    return templateApi.fahrzeugeControllerFindAllTypenV1();
  },
};

// mutate

export const deleteFahrzeugFromEinsatz = {
  mutationKey: ({ einsatzId, fahrzeugId }: { einsatzId: unknown; fahrzeugId: unknown }) => [queryKey, einsatzId, fahrzeugId, 'remove'],
  mutationFn: ({ fahrzeugId, einsatzId }: { fahrzeugId?: string; einsatzId: string | null }) =>
    async function () {
      if (!einsatzId || !fahrzeugId) {
        throw new Error('No einsatzId or fahrzeugId given. Please provide both.');
      }
      console.log('Remove fahrzeug from einsatz', fahrzeugId, einsatzId);

      return einsatzFahrzeugeApi.einsatzFahrzeugeControllerRemoveFromEinsatzV1({
        einsatzId: einsatzId,
        fahrzeugId: fahrzeugId,
      });
    },
};
export const postStatusForFahrzeug = {
  mutationKey: (props: { einsatzId: unknown; fahrzeuggId: unknown }) => [queryKey, ...[Object.values(props)], 'status'],
  mutationFn:
    ({ fahrzeugId, einsatzId }: { fahrzeugId?: string; einsatzId?: string | null }) =>
    async ({ statusId }: { statusId: string }) => {
      if (!einsatzId || !fahrzeugId) {
        throw new Error('No einsatzId or fahrzeugId given. Please provide both.');
      }
      console.log('Set status for fahrzeug', fahrzeugId, einsatzId);

      return einsatzFahrzeugeApi.einsatzFahrzeugeControllerChangeStatusV1({
        einsatzId: einsatzId,
        fahrzeugId: fahrzeugId,
        changeStatusDto: {
          statusId,
        },
      });
    },
};

export const postAllFahrzeugeJson = {
  queryKey: [queryKey, 'json'],
  mutationFn: async ({ json }: { json: string }) => {
    return templateApi.fahrzeugeControllerImportFahrzeugeV1({
      importManyFahrzeugeDto: JSON.parse(json),
    });
  },
};

// helper

export const patchFahrzeuge = {
  mutationKey: [queryKey, 'status'],
  mutationFn: async (fahrzeuge: ImportManyFahrzeugeDto) => {
    return templateApi.fahrzeugeControllerUpdateManyV1({
      importManyFahrzeugeDto: fahrzeuge,
    });
  },
};
