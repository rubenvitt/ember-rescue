import { getAPIConfig } from '../../utils/http.js';
import { createInvalidateQueries } from '../../utils/queries.js';
import { QueryClient } from '@tanstack/react-query';
import { SecretsApi } from '@bluelight-hub/shared/client/index.js';

type PossibleSecrets = 'mapboxApi';

// Export des queryKey
export const queryKey = (secretKey: PossibleSecrets) => ['secrets', secretKey];

// Invalidate Queries Funktion
export const invalidateQueries = (secretKey: PossibleSecrets, queryClient: QueryClient) => createInvalidateQueries(queryKey(secretKey), queryClient);

const api = new SecretsApi(getAPIConfig());

// GET Secret
export const fetchSecret = {
  queryKey,
  queryFn: async function (secretKey: PossibleSecrets) {
    return (
      await api.secretsControllerReadSecretV1({
        secret: secretKey,
      })
    ).data;
  },
};

// POST Secret
export const saveSecret = {
  mutationKey: queryKey,
  mutationFn: function (secretKey: PossibleSecrets) {
    return (value: string) =>
      api.secretsControllerCreateSecretV1({
        secretsDto: {
          key: secretKey,
          value: value,
        },
      });
  },
};
