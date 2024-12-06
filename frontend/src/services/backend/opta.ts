import { QueryClient } from '@tanstack/react-query';
import { createInvalidateQueries } from '../../utils/queries.js';
import { OptaApi } from '@ember-rescue/shared/client/index.js';
import { getAPIConfig } from '../../utils/http.js';

export const queryKey = ['opta'];

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries(queryKey, queryClient);

const api = new OptaApi(getAPIConfig());

// GET

export const fetchOpta = {
  queryKey: [...queryKey, 'function'],
  queryFn: async function () {
    return api.optaControllerFindFunctionOptaV1();
  },
};
