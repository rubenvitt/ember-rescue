import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { SettingsApi, SettingsDto } from '@ember-rescue/shared/client/index.js';

// Export des queryKey
export const queryKey = 'settings';

// Invalidate Queries Funktion
export const invalidateQueries = (queryClient: QueryClient) => createInvalidateQueries([queryKey], queryClient);

const api = new SettingsApi(getAPIConfig());

// GET Settings
export const fetchSettings = {
  queryKey: [queryKey],
  queryFn: function () {
    return api.settingsControllerFindSettingsV1();
  },
};

// POST Settings
export const saveSettings = {
  mutationKey: [queryKey],
  mutationFn: function (settings: SettingsDto) {
    return api.settingsControllerSaveSettingsV1({
      settingsDto: settings,
    });
  },
};
