import { useQuery } from '@tanstack/react-query';
import { StatusDto } from '../types.js';
import { fetch } from '@tauri-apps/plugin-http';

export function useStatus() {
  const status = useQuery<StatusDto[]>({
    queryKey: ['status'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/status');
      return response.json();
    },
  });

  return {
    status: {
      isLoading: status.isLoading,
      isFetched: status.isFetched,
      data: status.data,
    },
  };
}