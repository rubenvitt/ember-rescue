import { backendFetch } from '../../utils/http.js';
import { QualifikationDto } from '../../types/types.js';
import { createInvalidateQueries } from '../../utils/queries.js';

// Export des queryKey
export const queryKey = 'qualifikationen';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All Qualifikationen
export const fetchAllQualifikationen = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<QualifikationDto[]>('qualifikationen');
  },
};