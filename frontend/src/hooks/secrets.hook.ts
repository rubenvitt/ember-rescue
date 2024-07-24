import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../services/backend/index.js';

type PossibleSecrets = 'mapboxApi'

type Secrets = {
  key: string,
  value: string
}

type Props = { secretKey: PossibleSecrets }

export function useSecret({ secretKey }: Props) {
  const secret = useQuery<Secrets>({
    queryKey: services.secrets.fetchSecret.queryKey(secretKey),
    queryFn: () => services.secrets.fetchSecret.queryFn(secretKey),
  });

  const save = useMutation<unknown, unknown, string>({
    mutationKey: services.secrets.saveSecret.mutationKey(secretKey),
    mutationFn: services.secrets.saveSecret.mutationFn(secretKey),
    onSuccess: services.secrets.invalidateQueries(secretKey),
  });

  return { secret, save };
}