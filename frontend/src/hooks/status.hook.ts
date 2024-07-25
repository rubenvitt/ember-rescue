import { useQuery } from '@tanstack/react-query';
import { StatusDto } from '../types/types.js';
import { services } from '../services/index.js';

export function useStatus() {
  const status = useQuery<StatusDto[]>({
    queryKey: services.backend.status.fetchAllStatus.queryKey,
    queryFn: services.backend.status.fetchAllStatus.queryFn,
  });

  return { status };
}