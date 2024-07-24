import { useStore } from './store.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types/types.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { services } from '../services/backend/index.js';

type Props = {
  requireBearbeiter?: boolean;
}

export function useBearbeiter({ requireBearbeiter }: Props = {}) {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const navigate = useNavigate();

  const allBearbeiter = useQuery<Bearbeiter[]>({
    queryKey: services.bearbeiter.fetchAllBearbeiter.queryKey,
    queryFn: services.bearbeiter.fetchAllBearbeiter.queryFn,
  });

  const singleBearbeiter = useQuery<Bearbeiter, unknown, Bearbeiter>({
    queryKey: services.bearbeiter.fetchSingleBearbeiter.queryKey({ bearbeiterId: bearbeiter?.id }),
    queryFn: async () => {
      if (!bearbeiter?.id) return Promise.resolve(null);
      console.log('Fetching bearbeiter:', bearbeiter);
      return await services.bearbeiter.fetchSingleBearbeiter.queryFn({ bearbeiterId: bearbeiter?.id })
        .catch(() => {
          if (requireBearbeiter) {
            // redirect to login
            console.warn('Bearbeiter not found, redirecting to login');
            navigate({ to: '/signin' });
          }
          return null;
        });
    },
  });

  const loginBearbeiter = useMutation<Bearbeiter, unknown, Bearbeiter | NewBearbeiter>({
    mutationKey: services.bearbeiter.postNewBearbeiter.mutationKey,
    mutationFn: services.bearbeiter.postNewBearbeiter.mutationFn,
  });

  async function saveBearbeiter(bearbeiter: Bearbeiter | NewBearbeiter) {
    let loggedInBearbeiter = await loginBearbeiter.mutateAsync(bearbeiter);
    console.log('Saving bearbeiter:', bearbeiter, loggedInBearbeiter);
    setBearbeiter(loggedInBearbeiter);
    console.log('saved bearbeiter');
  }

  function remove() {
    console.log('Removing bearbeiter:', bearbeiter);
    removeBearbeiter();
  }

  return {
    bearbeiter: {
      data: singleBearbeiter.data,
      isFetched: singleBearbeiter.isFetched,
      isLoading: singleBearbeiter.isLoading,
    },
    allBearbeiter: {
      data: allBearbeiter.data,
      isFetched: allBearbeiter.isFetched,
      isLoading: allBearbeiter.isLoading,
    },
    saveBearbeiter,
    removeBearbeiter: remove,
  };
}