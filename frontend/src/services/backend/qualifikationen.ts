import { backendFetch } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QualifikationTypes } from '../../types/app/qualifikation.types.js';

// Export des queryKey
export const queryKey = 'qualifikationen';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET All Qualifikationen
export const fetchAllQualifikationen = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<QualifikationTypes[]>('qualifikationen');
  },
};