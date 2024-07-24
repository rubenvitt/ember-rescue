import { backendFetch } from '../../utils/http.js';
import { EinheitDto, EinheitTypDto } from '../../types/types.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';

export const queryKey = 'einheiten';

export type PatchEinheitenType = (Omit<EinheitDto, '_count' | 'status' | 'einheitTyp' | 'id'> & Partial<Pick<EinheitDto, 'id'>> & {
  einheitTypId: string
})[]

export const invalidateQueries = createInvalidateQueries([queryKey]);

/// fetch

export const fetchAllEinheiten = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<EinheitDto[]>('einheiten');
  },
};

export const fetchAllEinheitenImEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: ({ einsatzId }: { einsatzId: string | null }) => function() {
    requireParams(einsatzId);
    return backendFetch<EinheitDto[]>(`/einsatz/${einsatzId}/einheiten`);
  },
};

export const postAddEinheitToEinsatz = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn: ({ einsatzId }: { einsatzId: string | null }) => async ({ einheitId }: { einheitId?: string }) => {
    console.log('Add einheit to einsatz', einheitId, einsatzId);
    return await backendFetch<{ status: string }>(`/einsatz/${einsatzId}/einheiten/add`, {
      body: JSON.stringify({
        einheitId,
      }),
      method: 'POST',
    });
  },
};


export const fetchEinheitenTypen = {
  queryKey: [queryKey, 'typen'],
  queryFn: function() {
    return backendFetch<EinheitTypDto[]>('/einheiten/typen');
  },
};

// mutate

export const deleteEinheitFromEinsatz = {
  mutationKey: ({ einsatzId, einheitId }: {
    einsatzId: unknown,
    einheitId: unknown
  }) => [queryKey, einsatzId, einheitId, 'remove'],
  mutationFn: ({ einheitId, einsatzId }: { einheitId?: string, einsatzId: string | null }) => async function() {
    requireParams(einheitId, einsatzId);
    return await backendFetch(`/einsatz/${einsatzId}/einheiten/${einheitId}`, {
      method: 'DELETE',
    });
  },
};
export const postStatusForEinheit = {
  mutationKey: (props: {
    einsatzId: unknown,
    einheitId: unknown,
  }) => [queryKey, ...[Object.values(props)], 'status'],
  mutationFn: ({ einheitId, einsatzId }: { einheitId?: string, einsatzId?: string | null }) => async ({ statusId }: {
    statusId: string
  }) => {
    requireParams(einheitId, einsatzId);
    return await backendFetch(`/einsatz/${einsatzId}/einheiten/${einheitId}/status`, {
      body: JSON.stringify({
        statusId,
      }),
      method: 'POST',
    });
  },
};

// helper

export const patchEinheiten = {
  mutationKey: [queryKey, 'status'],
  mutationFn: async (einheiten: PatchEinheitenType) => {
    return await backendFetch('/einheiten', {
      method: 'PATCH',
      body: JSON.stringify(einheiten),
    });
  },
};
