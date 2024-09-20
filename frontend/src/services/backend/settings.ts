import { backendFetchJson } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { Settings } from '../../hooks/settings.hook.js';
import { QueryClient } from '@tanstack/react-query';

// Export des queryKey
export const queryKey = 'settings';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

// GET Settings
export const fetchSettings = {
  queryKey: [queryKey],
  queryFn: function () {
    return backendFetchJson<Settings>('settings');
  },
};

// POST Settings
export const saveSettings = {
  mutationKey: [queryKey],
  mutationFn: function (settings: Settings) {
    return backendFetchJson('/settings', {
      body: JSON.stringify(settings),
      method: 'POST',
    });
  },
};
