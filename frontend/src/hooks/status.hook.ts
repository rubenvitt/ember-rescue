import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { StatusDto } from '../types/app/status.types.js';

export function useStatus() {
  const status = useQuery<StatusDto[]>({
    queryKey: services.backend.status.fetchAllStatus.queryKey,
    queryFn: services.backend.status.fetchAllStatus.queryFn,
  });

  return { status };
}