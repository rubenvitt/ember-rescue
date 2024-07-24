import { useMutation, useQuery } from '@tanstack/react-query';
import { EinheitDto } from '../types/types.js';
import { services } from '../services/backend/index.js';

export type Settings = {
  mapboxApi: string;
  einheiten: EinheitDto[];
};

export function useSettings() {
  const settings = useQuery<Settings>({
    queryKey: services.settings.fetchSettings.queryKey,
    queryFn: services.settings.fetchSettings.queryFn,
  });

  const save = useMutation<unknown, unknown, Settings>({
    mutationKey: services.settings.saveSettings.mutationKey,
    mutationFn: services.settings.saveSettings.mutationFn,
    onSuccess: () => {
      return Promise.all([
        services.settings.invalidateQueries(),
        services.einheiten.invalidateQueries(),
      ]);
    },
  });

  return { settings, save };
}