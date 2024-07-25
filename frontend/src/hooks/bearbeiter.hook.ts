import { useStore } from './store.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types/types.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { services } from '../services/index.js';

type Props = {
  requireBearbeiter?: boolean;
}

export function useBearbeiter({ requireBearbeiter }: Props = {}) {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const navigate = useNavigate();

  const allBearbeiter = useQuery<Bearbeiter[]>({
    queryKey: services.backend.bearbeiter.fetchAllBearbeiter.queryKey,
    queryFn: services.backend.bearbeiter.fetchAllBearbeiter.queryFn,
  });

  const singleBearbeiter = useQuery<Bearbeiter, unknown, Bearbeiter>({
    queryKey: services.backend.bearbeiter.fetchSingleBearbeiter.queryKey({ bearbeiterId: bearbeiter?.id }),
    queryFn: async () => {
      if (!bearbeiter?.id) return null;
      try {
        return await services.backend.bearbeiter.fetchSingleBearbeiter.queryFn({ bearbeiterId: bearbeiter?.id });
      } catch (error) {
        if (requireBearbeiter) {
          console.warn('Bearbeiter not found, redirecting to login');
          navigate({ to: '/signin' });
        }
        return null;
      }
    },
  });

  const loginBearbeiter = useMutation<Bearbeiter, unknown, Bearbeiter | NewBearbeiter>({
    mutationKey: services.backend.bearbeiter.postNewBearbeiter.mutationKey,
    mutationFn: services.backend.bearbeiter.postNewBearbeiter.mutationFn,
    onSuccess: services.backend.bearbeiter.invalidateQueries,
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
    services.backend.bearbeiter.invalidateQueries();
  }

  return {
    bearbeiter: singleBearbeiter,
    allBearbeiter,
    saveBearbeiter,
    removeBearbeiter: remove,
  };
}