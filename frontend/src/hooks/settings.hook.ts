import { useMutation, useQuery } from '@tanstack/react-query';
import { backendFetch } from '../lib/http.js';
import { EinheitDto } from '../types.js';

export type Settings = {
  mapboxApi: string,
  einheiten: EinheitDto[]
}

export function useSettings() {
  let query = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: () => {
      return backendFetch('/settings');
    },
  });

  const mutation = useMutation<void, unknown, Settings>({
    mutationKey: ['settings'],
    mutationFn: (settings) => {
      return backendFetch('/settings', {
        body: JSON.stringify(settings),
        method: 'POST',
      });
    },
  });

  return { settings: query, save: mutation };
}