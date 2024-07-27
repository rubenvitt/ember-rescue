import { backendFetch } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { CreateEinsatz, Einsatz } from '../../types/app/einsatz.types.js';

// Export des queryKey
export const queryKey = 'einsatz';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey, 'offeneEinsaetze']);

// GET Single Einsatz
export const fetchSingleEinsatz = {
  queryKey: ({ einsatzId }: { einsatzId: unknown }) => [queryKey, einsatzId],
  queryFn: function({ einsatzId }: { einsatzId: string | null }) {
    requireParams(einsatzId);
    return backendFetch<Einsatz>(`/einsatz/${einsatzId}`);
  },
};

// GET All offene Einsätze
export const fetchOffeneEinsaetze = {
  queryKey: [queryKey, 'offeneEinsaetze'],
  queryFn: function() {
    return backendFetch<Einsatz[]>('/einsatz?abgeschlossen=false');
  },
};

// POST New Einsatz
export const createEinsatz = {
  mutationKey: [queryKey, 'add'],
  mutationFn: async (data: CreateEinsatz) => {
    return await backendFetch<Einsatz>('/einsatz', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

// PUT Abschluss eines Einsatzes
export const einsatzAbschliessen = {
  mutationKey: ({ einsatzId }: { einsatzId: string | null }) => [queryKey, einsatzId, 'close'],
  mutationFn: async (einsatz: Einsatz) => {
    requireParams(einsatz);
    return await backendFetch(`/einsatz/${einsatz.id}/close`, {
      method: 'PUT',
    });
  },
};