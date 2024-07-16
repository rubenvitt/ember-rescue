import { useQuery } from '@tanstack/react-query';
import { StatusDto } from '../types/types.js';
import { backendFetch } from '../utils/http.js';

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