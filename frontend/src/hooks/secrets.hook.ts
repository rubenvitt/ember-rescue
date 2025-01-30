import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { SecretsDto } from '@bluelight-hub/shared/client/index.js';

type PossibleSecrets = 'mapboxApi';

type Props = { secretKey: PossibleSecrets };

export function useSecret({ secretKey }: Props) {
  const queryClient = useQueryClient();
  const secret = useQuery<SecretsDto>({
    queryKey: services.backend.secrets.fetchSecret.queryKey(secretKey),
    queryFn: () => services.backend.secrets.fetchSecret.queryFn(secretKey),
  });

  const save = useMutation<unknown, unknown, string>({
    mutationKey: services.backend.secrets.saveSecret.mutationKey(secretKey),
    mutationFn: services.backend.secrets.saveSecret.mutationFn(secretKey),
    onSuccess: services.backend.secrets.invalidateQueries(secretKey, queryClient),
  });

  return { secret, save };
}
