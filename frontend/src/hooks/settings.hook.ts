import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { SettingsDto, SettingsResponse } from '@bluelight-hub/shared/client/index.js';

export function useSettings() {
  const queryClient = useQueryClient();
  const settings = useQuery<SettingsResponse>({
    queryKey: services.backend.settings.fetchSettings.queryKey,
    queryFn: services.backend.settings.fetchSettings.queryFn,
  });

  const save = useMutation<unknown, unknown, SettingsDto>({
    mutationKey: services.backend.settings.saveSettings.mutationKey,
    mutationFn: services.backend.settings.saveSettings.mutationFn,
    onSuccess: async () => {
      return await Promise.all([services.backend.settings.invalidateQueries(queryClient)(), services.backend.fahrzeuge.invalidateQueries(queryClient)()]);
    },
  });

  return { settings, save };
}
