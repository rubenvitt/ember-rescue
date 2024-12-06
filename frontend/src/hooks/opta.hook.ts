import { useQuery } from '@tanstack/react-query';
import { ManyFunctionOptaTemplatesResponse } from '@ember-rescue/shared/client/index.js';
import { services } from '../services/index.js';

export function useOpta() {
  // for query invalidation:
  //const queryClient = useQueryClient();

  const functionOpta = useQuery<ManyFunctionOptaTemplatesResponse>({
    queryKey: services.backend.opta.fetchOpta.queryKey,
    queryFn: services.backend.opta.fetchOpta.queryFn,
  });

  return { functionOpta };
}
