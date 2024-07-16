import { useMutation, useQuery } from '@tanstack/react-query';
import { backendFetch } from '../utils/http.js';

type PossibleSecrets = 'mapboxApi'

type Secrets = {
  key: string,
  value: string
}

type Props = { secretKey: PossibleSecrets }

export function useSecret({ secretKey }: Props) {
  let query = useQuery<Secrets>({
    queryKey: ['secrets', secretKey],
    queryFn: () => {
      return backendFetch(`/secrets/${secretKey}`);
    },
  });

  const mutation = useMutation<void, unknown, string>({
    mutationKey: ['secrets', secretKey],
    mutationFn: (value) => {
      return backendFetch('/secrets', {
        body: JSON.stringify({
          key: secretKey,
          value: value,
        }),
        method: 'POST',
      });
    },
  });

  return { secret: query, save: mutation };
}