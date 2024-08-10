import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { StatusDto } from '../../types/app/status.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'status';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET All Status
export const fetchAllStatus = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetchJson<StatusDto[]>('status');
  },
};