import { backendFetch } from '../../utils/http.js';
import { StatusDto } from '../../types/types.js';
import { createInvalidateQueries } from '../../utils/queries.js';

// Export des queryKey
export const queryKey = 'status';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All Status
export const fetchAllStatus = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<StatusDto[]>('status');
  },
};