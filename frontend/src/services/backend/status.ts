import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { StatusApi } from '@bluelight-hub/shared/client/index.js';

// Export des queryKey
export const queryKey = 'status';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new StatusApi(getAPIConfig());

// GET All Status
export const fetchAllStatus = {
  queryKey: [queryKey],
  queryFn: function () {
    return api.statusControllerStatusV1({});
  },
};
