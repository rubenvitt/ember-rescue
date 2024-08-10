import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { Alarmstichwort } from '../../types/app/alarmstichwort.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'alarmstichwort';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET All Alarmstichworte
export const fetchAllAlarmstichworte = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetchJson<Alarmstichwort[]>('alarmstichwort');
  },
};