import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { CreateEinsatztagebuchEintrag, EinsatztagebuchEintrag } from '../../types/app/einsatztagebuch.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'einsatztagebuch';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET All EinsatztagebuchEinträge
export const fetchAllEinsatztagebuchEintraege = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: function() {
    return backendFetchJson<EinsatztagebuchEintrag[]>('einsatztagebuch');
  },
};

// POST New EinsatztagebuchEintrag
export const createEinsatztagebuchEintrag = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn: async (einsatztagebuchEintrag: CreateEinsatztagebuchEintrag) => {
    return await backendFetchJson<EinsatztagebuchEintrag>('/einsatztagebuch', {
      method: 'POST',
      body: JSON.stringify(einsatztagebuchEintrag),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

// POST Archive EinsatztagebuchEintrag
export const archiveEinsatztagebuchEintrag = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'archive'],
  mutationFn: async ({ einsatztagebuchEintragId }: { einsatztagebuchEintragId: string }) => {
    requireParams(einsatztagebuchEintragId);
    return await backendFetchJson(`/einsatztagebuch/${einsatztagebuchEintragId}/archive`, {
      method: 'POST',
    });
  },
};