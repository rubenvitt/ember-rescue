import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { EinheitDto } from '../types/app/einheit.types.js';

export type Settings = {
  mapboxApi: string;
  einheiten: EinheitDto[];
};

export function useSettings() {
  const settings = useQuery<Settings>({
    queryKey: services.backend.settings.fetchSettings.queryKey,
    queryFn: services.backend.settings.fetchSettings.queryFn,
  });

  const save = useMutation<unknown, unknown, Settings>({
    mutationKey: services.backend.settings.saveSettings.mutationKey,
    mutationFn: services.backend.settings.saveSettings.mutationFn,
    onSuccess: () => {
      return Promise.all([
        services.backend.settings.invalidateQueries(),
        services.backend.einheiten.invalidateQueries(),
      ]);
    },
  });

  return { settings, save };
}