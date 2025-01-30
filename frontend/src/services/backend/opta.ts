import { QueryClient } from '@tanstack/react-query';
import { createInvalidateQueries } from '../../utils/queries.js';
import { OptaApi } from '@bluelight-hub/shared/client/index.js';
import { getAPIConfig } from '../../utils/http.js';

export const queryKey = ['opta'];

export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries(queryKey, queryClient);

const api = new OptaApi(getAPIConfig());

// GET

export const fetchFunctionOpta = {
  queryKey: [...queryKey, 'function'],
  queryFn: async function () {
    return api.optaControllerFindFunctionOptaV1();
  },
};

export const fetchDistrictOpta = {
  queryKey: [...queryKey, 'district'],
  queryFn: async function () {
    return api.optaControllerFindDistrictOptaV1();
  },
};

export const fetchLocalCodeOpta = {
  queryKey: [...queryKey, 'local-code'],
  queryFn: async function () {
    return api.optaControllerFindLocalCodeOptaV1();
  },
};

export const fetchBosOpta = {
  queryKey: [...queryKey, 'bos'],
  queryFn: async function () {
    return api.optaControllerFindBosOptaV1();
  },
};
