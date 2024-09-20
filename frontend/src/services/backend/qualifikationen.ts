import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QualifikationTypes } from '../../types/app/qualifikation.types.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'qualifikationen';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET All Qualifikationen
export const fetchAllQualifikationen = {
  queryKey: [queryKey],
  queryFn: function () {
    return backendFetchJson<QualifikationTypes[]>('qualifikationen');
  },
};
