import { backendFetch } from '../../utils/http.js';
import { Bearbeiter, NewBearbeiter } from '../../types/types.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';

// Export des queryKey
export const queryKey = 'bearbeiter';
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All Bearbeiter
export const fetchAllBearbeiter = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<Bearbeiter[]>('bearbeiter');
  },
};

// GET Single Bearbeiter
export const fetchSingleBearbeiter = {
  queryKey: ({ bearbeiterId }: { bearbeiterId?: string }) => [queryKey, bearbeiterId],
  queryFn: function({ bearbeiterId }: { bearbeiterId: string }) {
    requireParams(bearbeiterId);
    return backendFetch<Bearbeiter | null>(`/bearbeiter/${bearbeiterId}`);
  },
};

// POST New Bearbeiter
export const postNewBearbeiter = {
  mutationKey: [queryKey, 'add'],
  mutationFn: async (bearbeiter: Bearbeiter | NewBearbeiter) => {
    return await backendFetch<Bearbeiter>('/bearbeiter', {
      method: 'POST',
      body: JSON.stringify(bearbeiter),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};