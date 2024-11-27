import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { QualifikationenApi } from '@ember-rescue/shared/client/index.js';

// Export des queryKey
export const queryKey = 'qualifikationen';
//const api = new QualifikationenApi(APIConfig);

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

function api() {
  return new QualifikationenApi(getAPIConfig());
}

// GET All Qualifikationen
export const fetchAllQualifikationen = {
  queryKey: [queryKey],
  queryFn: async function () {
    return api().qualifikationenControllerFindAllV1();
  },
};
