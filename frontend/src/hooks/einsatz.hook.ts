import { useMutation } from '@tanstack/react-query';
import { backendFetch } from '../lib/http.js';

export function useEinsatz() {
  const einsatz = {
    isLoading: false,
    isFetched: true,
    data: null,
  };

  const createEinsatz = useMutation<unknown, unknown, unknown>({
    mutationFn: async (data: unknown) => {
      console.log('mutate with data', data);
      return backendFetch('/einsatz', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  return {
    einsatz, createEinsatz: {
      isPending: createEinsatz.isPending,
      isSuccess: createEinsatz.isSuccess,
      isError: createEinsatz.isError,
      mutate: createEinsatz.mutate,
      mutateAsync: createEinsatz.mutateAsync,
    },
  };
}