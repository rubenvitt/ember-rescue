import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { AlarmstichwortApi } from '@ember-rescue/shared/client/index.js';

// Export des queryKey
export const queryKey = 'alarmstichwort';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new AlarmstichwortApi(getAPIConfig());

// GET All Alarmstichworte
export const fetchAllAlarmstichworte = {
  queryKey: [queryKey],
  queryFn: function () {
    return api.alarmstichwortControllerGetAlarmstichworteV1();
  },
};
