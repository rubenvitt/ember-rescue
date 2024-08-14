import { useStore } from './store.hook.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { useNavigate } from '@tanstack/react-router';
import { Bearbeiter, CreateBearbeiter } from '../types/app/bearbeiter.types.js';

type Props = {
  requireBearbeiter?: boolean;
}

export function useBearbeiter({ requireBearbeiter }: Props = {}) {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allBearbeiter = useQuery<Bearbeiter[]>({
    queryKey: services.backend.bearbeiter.fetchAllBearbeiter.queryKey,
    queryFn: services.backend.bearbeiter.fetchAllBearbeiter.queryFn,
  });

  const singleBearbeiter = useQuery<Bearbeiter | null, unknown>({
    queryKey: services.backend.bearbeiter.fetchSingleBearbeiter.queryKey({ bearbeiterId: bearbeiter?.id }),
    queryFn: async (): Promise<Bearbeiter | null> => {
      if (!bearbeiter || !bearbeiter.id) return null; // Korrigierte Überprüfung
      const foundBearbeiter = await services.backend.bearbeiter.fetchSingleBearbeiter.queryFn({ bearbeiterId: bearbeiter.id });
      console.log('found single bearbeiter', bearbeiter, foundBearbeiter);
      if (!foundBearbeiter) return Promise.reject(new Error('no bearbeiter found'));
      return foundBearbeiter;
    },
    retry: failureCount => {
      if (failureCount === 10) {
        if (requireBearbeiter) {
          console.warn('Bearbeiter not found, redirecting to login');
          navigate({ to: '/auth/signout' });
        }
        return false;
      }

      return true;
    },
  });

  const loginBearbeiter = useMutation<Bearbeiter, unknown, Bearbeiter | CreateBearbeiter>({
    mutationKey: services.backend.bearbeiter.postNewBearbeiter.mutationKey,
    mutationFn: services.backend.bearbeiter.postNewBearbeiter.mutationFn,
    onSuccess: services.backend.bearbeiter.invalidateQueries(queryClient),
  });

  async function saveBearbeiter(bearbeiter: Bearbeiter | CreateBearbeiter) {
    let loggedInBearbeiter = await loginBearbeiter.mutateAsync(bearbeiter);
    console.log('Saving bearbeiter:', bearbeiter, loggedInBearbeiter);
    setBearbeiter(loggedInBearbeiter);
    console.log('saved bearbeiter');
  }

  function remove() {
    console.log('Removing bearbeiter:', bearbeiter);
    removeBearbeiter();
    services.backend.bearbeiter.invalidateQueries(queryClient);
  }

  return {
    bearbeiter: singleBearbeiter,
    allBearbeiter,
    saveBearbeiter,
    removeBearbeiter: remove,
  };
}