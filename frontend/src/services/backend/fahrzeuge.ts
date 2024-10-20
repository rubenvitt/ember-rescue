import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { FahrzeugDto, FahrzeugTypDto } from '../../types/app/fahrzeug.types.js';
import { QueryClient } from '@tanstack/react-query';

export const queryKey = 'fahrzeuge';

export type PatchFahrzeugType = Omit<FahrzeugDto, '_count' | 'status' | 'fahrzeugTyp' | 'id'> &
  Partial<Pick<FahrzeugDto, 'id'>> & {
    fahrzeugTypId: string;
  };

export type PatchFahrzeugeType = PatchFahrzeugType[];

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

/// fetch

export const fetchAllFahrzeuge = {
  queryKey: [queryKey],
  queryFn: function () {
    return backendFetchJson<FahrzeugDto[]>('fahrzeuge');
  },
};

export const fetchAllFahrzeugeImEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: ({ einsatzId }: { einsatzId: string | null }) =>
    function () {
      requireParams(einsatzId);
      return backendFetchJson<FahrzeugDto[]>(`/einsatz/${einsatzId}/fahrzeuge`);
    },
};

export const postAddFahrzeugToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn:
    ({ einsatzId }: { einsatzId: string | null }) =>
    async ({ fahrzeugId }: { fahrzeugId: string }) => {
      console.log('Add fahrzeug to einsatz', fahrzeugId, einsatzId);
      return await backendFetchJson<{ status: string }>(`/einsatz/${einsatzId}/fahrzeuge/add`, {
        body: JSON.stringify({
          fahrzeugId,
        }),
        method: 'POST',
      });
    },
};

export const fetchFahrzeugTypen = {
  queryKey: [queryKey, 'typen'],
  queryFn: function () {
    return backendFetchJson<FahrzeugTypDto[]>('/fahrzeuge/typen');
  },
};

// mutate

export const deleteFahrzeugFromEinsatz = {
  mutationKey: ({ einsatzId, fahrzeugId }: { einsatzId: unknown; fahrzeugId: unknown }) => [
    queryKey,
    einsatzId,
    fahrzeugId,
    'remove',
  ],
  mutationFn: ({ fahrzeugId, einsatzId }: { fahrzeugId?: string; einsatzId: string | null }) =>
    async function () {
      requireParams(fahrzeugId, einsatzId);
      return await backendFetchJson(`/einsatz/${einsatzId}/fahrzeuge/${fahrzeugId}`, {
        method: 'DELETE',
      });
    },
};
export const postStatusForFahrzeug = {
  mutationKey: (props: { einsatzId: unknown; fahrzeuggId: unknown }) => [queryKey, ...[Object.values(props)], 'status'],
  mutationFn:
    ({ fahrzeugId, einsatzId }: { fahrzeugId?: string; einsatzId?: string | null }) =>
    async ({ statusId }: { statusId: string }) => {
      requireParams(fahrzeugId, einsatzId);
      return await backendFetchJson(`/einsatz/${einsatzId}/fahrzeuge/${fahrzeugId}/status`, {
        body: JSON.stringify({
          statusId,
        }),
        method: 'POST',
      });
    },
};

// helper

export const patchFahrzeuge = {
  mutationKey: [queryKey, 'status'],
  mutationFn: async (fahrzeuge: PatchFahrzeugeType) => {
    return await backendFetchJson('/fahrzeuge', {
      method: 'PATCH',
      body: JSON.stringify(fahrzeuge),
    });
  },
};
