import { useQuery } from '@tanstack/react-query';
import { EinheitDto } from '../types.js';
import { fetch } from '@tauri-apps/plugin-http';

export function useEinheiten({ einsatzId }: { einsatzId?: string } = {}) {
  const { data: einheiten, isLoading, isFetched } = useQuery<EinheitDto[]>({
    queryKey: ['einheiten'],
    queryFn: async () => fetch('http://localhost:3000/einheiten').then((res) => {
      console.log('einheiten res', res);
      return res.json();
    }),
  });

  return { einheiten: { data: einsatzId ? [] : einheiten, isLoading, isFetched } };
}