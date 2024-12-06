import { useQuery } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { ManyStatusDtoReponse } from '@ember-rescue/shared/client/index.js';

export function useStatus() {
  const status = useQuery<ManyStatusDtoReponse>({
    queryKey: services.backend.status.fetchAllStatus.queryKey,
    queryFn: services.backend.status.fetchAllStatus.queryFn,
  });

  return { status };
}
