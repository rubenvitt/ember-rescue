import { useQuery } from '@tanstack/react-query';
import { StatusDto } from '../types/types.js';
import { services } from '../services/backend/index.js';

export function useStatus() {
  const status = useQuery<StatusDto[]>({
    queryKey: services.status.fetchAllStatus.queryKey,
    queryFn: services.status.fetchAllStatus.queryFn,
  });

  return { status };
}