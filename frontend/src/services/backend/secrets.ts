import { backendFetch } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';

type PossibleSecrets = 'mapboxApi';
type Secrets = {
  key: string;
  value: string;
};

// Export des queryKey
export const queryKey = (secretKey: PossibleSecrets) => ['secrets', secretKey];

// Invalidate Queries Funktion
export const invalidateQueries = (secretKey: PossibleSecrets) =>
  createInvalidateQueries([queryKey(secretKey)]);

// GET Secret
export const fetchSecret = {
  queryKey,
  queryFn: function(secretKey: PossibleSecrets) {
    return backendFetch<Secrets>(`/secrets/${secretKey}`);
  },
};

// POST Secret
export const saveSecret = {
  mutationKey: queryKey,
  mutationFn: function(secretKey: PossibleSecrets) {
    return (value: string) => backendFetch('/secrets', {
      body: JSON.stringify({
        key: secretKey,
        value: value,
      }),
      method: 'POST',
    });
  },
};