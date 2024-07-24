import { backendFetch } from '../../utils/http.js';
import { CreateEinsatztagebuchEintrag, EinsatztagebuchEintrag } from '../../types/types.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';

// Export des queryKey
export const queryKey = 'einsatztagebuch';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All EinsatztagebuchEinträge
export const fetchAllEinsatztagebuchEintraege = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: function() {
    return backendFetch<EinsatztagebuchEintrag[]>('einsatztagebuch');
  },
};

// POST New EinsatztagebuchEintrag
export const createEinsatztagebuchEintrag = {
  mutationKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId, 'add'],
  mutationFn: async (einsatztagebuchEintrag: CreateEinsatztagebuchEintrag) => {
    return await backendFetch<EinsatztagebuchEintrag>('/einsatztagebuch', {
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
    return await backendFetch(`/einsatztagebuch/${einsatztagebuchEintragId}/archive`, {
      method: 'POST',
    });
  },
};