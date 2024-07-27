import { backendFetch } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { Alarmstichwort } from '../../types/app/alarmstichwort.types.js';

// Export des queryKey
export const queryKey = 'alarmstichwort';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All Alarmstichworte
export const fetchAllAlarmstichworte = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<Alarmstichwort[]>('alarmstichwort');
  },
};