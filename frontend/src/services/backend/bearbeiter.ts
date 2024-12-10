import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { BearbeiterCoreApi, CreateBearbeiterDto, ResponseError } from '@bluelight-hub/shared/client/index.js';

// Export des queryKey
export const queryKey = 'bearbeiter';
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

function api() {
  return new BearbeiterCoreApi(getAPIConfig());
}

// GET All Bearbeiter
export const fetchAllBearbeiter = {
  queryKey: [queryKey],
  queryFn: async function () {
    const result = await api().bearbeiterCoreControllerFindAllV1();
    console.log('result of finding all bearbeiter', result);

    return result;
  },
};

// GET Single Bearbeiter
export const fetchSingleBearbeiter = {
  queryKey: ({ bearbeiterId }: { bearbeiterId?: string }) => [queryKey, bearbeiterId],
  queryFn: function ({ bearbeiterId }: { bearbeiterId: string }) {
    if (!bearbeiterId) {
      console.warn('Try to fetch bearbeiterId null');
    }

    return api().bearbeiterCoreControllerFindOneV1({
      name: bearbeiterId,
    });
  },
};

// POST New Bearbeiter
export const postNewBearbeiter = {
  mutationKey: [queryKey, 'add'],
  mutationFn: async (bearbeiter: CreateBearbeiterDto) => {
    let oneBearbeiterResponse = await api()
      .bearbeiterCoreControllerLoginV1({
        createBearbeiterDto: bearbeiter,
      })
      .catch((e: ResponseError) => {
        console.error('Error while creating new bearbeiter', { e: e });
        throw e;
      });
    console.log('oneBearbeiterResponse', oneBearbeiterResponse);
    return oneBearbeiterResponse;
  },
};
