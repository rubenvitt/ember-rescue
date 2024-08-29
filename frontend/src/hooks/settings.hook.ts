import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';

export type Settings = {
  mapboxApi: string;
};

export function useSettings() {
  const queryClient = useQueryClient();
  const settings = useQuery<Settings>({
    queryKey: services.backend.settings.fetchSettings.queryKey,
    queryFn: services.backend.settings.fetchSettings.queryFn,
  });

  const save = useMutation<unknown, unknown, Settings>({
    mutationKey: services.backend.settings.saveSettings.mutationKey,
    mutationFn: services.backend.settings.saveSettings.mutationFn,
    onSuccess: () => {
      return Promise.all([
        services.backend.settings.invalidateQueries(queryClient),
        services.backend.einheiten.invalidateQueries(queryClient),
      ]);
    },
  });

  return { settings, save };
}