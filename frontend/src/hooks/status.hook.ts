import { useQuery } from '@tanstack/react-query';
import { StatusDto } from '../types.js';
import { backendFetch } from '../lib/http.js';

export function useStatus() {
  const status = useQuery<StatusDto[]>({
    queryKey: ['status'],
    queryFn: async () => await backendFetch('/status'),
  });

  return {
    status: {
      isLoading: status.isLoading,
      isFetched: status.isFetched,
      data: status.data,
    },
  };
}