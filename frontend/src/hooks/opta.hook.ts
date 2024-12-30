import { useQuery } from '@tanstack/react-query';
import { ManyBosOptaTemplatesResponse, ManyDistrictOptaTemplatesResponse, ManyFunctionOptaTemplatesResponse, ManyLocalCodeOptaTemplatesResponse } from '@bluelight-hub/shared/client/index.js';
import { services } from '../services/index.js';

export function useOpta() {
  // for query invalidation:
  //const queryClient = useQueryClient();

  const functionOpta = useQuery<ManyFunctionOptaTemplatesResponse>({
    queryKey: services.backend.opta.fetchFunctionOpta.queryKey,
    queryFn: services.backend.opta.fetchFunctionOpta.queryFn,
  });

  const districtOpta = useQuery<ManyDistrictOptaTemplatesResponse>({
    queryKey: services.backend.opta.fetchDistrictOpta.queryKey,
    queryFn: services.backend.opta.fetchDistrictOpta.queryFn,
  });

  const localCodeOpta = useQuery<ManyLocalCodeOptaTemplatesResponse>({
    queryKey: services.backend.opta.fetchLocalCodeOpta.queryKey,
    queryFn: services.backend.opta.fetchLocalCodeOpta.queryFn,
  });

  const bosOpta = useQuery<ManyBosOptaTemplatesResponse>({
    queryKey: services.backend.opta.fetchBosOpta.queryKey,
    queryFn: services.backend.opta.fetchBosOpta.queryFn,
  });

  return { functionOpta, districtOpta, localCodeOpta, bosOpta };
}
