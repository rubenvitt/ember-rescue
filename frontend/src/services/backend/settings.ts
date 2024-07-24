import { backendFetch } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { Settings } from '../../hooks/settings.hook.js';

// Export des queryKey
export const queryKey = 'settings';

// Invalidate Queries Funktion
export const invalidateQueries = createInvalidateQueries([queryKey]);

// GET Settings
export const fetchSettings = {
  queryKey: [queryKey],
  queryFn: function() {
    return backendFetch<Settings>('settings');
  },
};

// POST Settings
export const saveSettings = {
  mutationKey: [queryKey],
  mutationFn: function(settings: Settings) {
    return backendFetch('/settings', {
      body: JSON.stringify(settings),
      method: 'POST',
    });
  },
};