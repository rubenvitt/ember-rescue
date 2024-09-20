import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries, requireParams } from '../../utils/queries.js';
import { Bearbeiter, CreateBearbeiter } from '../../types/app/bearbeiter.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'bearbeiter';
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET All Bearbeiter
export const fetchAllBearbeiter = {
  queryKey: [queryKey],
  queryFn: function () {
    return backendFetchJson<Bearbeiter[]>('bearbeiter');
  },
};

// GET Single Bearbeiter
export const fetchSingleBearbeiter = {
  queryKey: ({ bearbeiterId }: { bearbeiterId?: string }) => [queryKey, bearbeiterId],
  queryFn: function ({ bearbeiterId }: { bearbeiterId: string }) {
    requireParams(bearbeiterId);
    return backendFetchJson<Bearbeiter | null>(`/bearbeiter/${bearbeiterId}`);
  },
};

// POST New Bearbeiter
export const postNewBearbeiter = {
  mutationKey: [queryKey, 'add'],
  mutationFn: async (bearbeiter: Bearbeiter | CreateBearbeiter) => {
    return await backendFetchJson<Bearbeiter>('/bearbeiter', {
      method: 'POST',
      body: JSON.stringify(bearbeiter),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};
