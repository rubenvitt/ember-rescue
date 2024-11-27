import { useStore } from './store.hook.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { services } from '../services/index.js';
import { useNavigate } from '@tanstack/react-router';
import {
  BearbeiterDto,
  CreateBearbeiterDto,
  ManyBearbeiterResponse,
  OneBearbeiterResponse,
} from '@ember-rescue/shared/client/index.js';

type Props = {
  requireBearbeiter?: boolean;
};

export function useBearbeiter({ requireBearbeiter }: Props = {}) {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allBearbeiter = useQuery<ManyBearbeiterResponse>({
    queryKey: services.backend.bearbeiter.fetchAllBearbeiter.queryKey,
    queryFn: services.backend.bearbeiter.fetchAllBearbeiter.queryFn,
  });

  const singleBearbeiter = useQuery<(OneBearbeiterResponse & { data: BearbeiterDto }) | null, unknown>({
    queryKey: services.backend.bearbeiter.fetchSingleBearbeiter.queryKey({ bearbeiterId: bearbeiter?.name }),
    queryFn: async (): Promise<(OneBearbeiterResponse & { data: BearbeiterDto }) | null> => {
      if (!bearbeiter || !bearbeiter.name) return null; // Korrigierte Überprüfung
      const foundBearbeiter = await services.backend.bearbeiter.fetchSingleBearbeiter.queryFn({
        bearbeiterId: bearbeiter.name,
      });
      if (!foundBearbeiter.data) return Promise.reject(new Error('no bearbeiter found'));

      return foundBearbeiter as OneBearbeiterResponse & { data: BearbeiterDto };
    },
    retry: (failureCount) => {
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

  const loginBearbeiter = useMutation<OneBearbeiterResponse, unknown, CreateBearbeiterDto>({
    mutationKey: services.backend.bearbeiter.postNewBearbeiter.mutationKey,
    mutationFn: services.backend.bearbeiter.postNewBearbeiter.mutationFn,
    onSuccess: services.backend.bearbeiter.invalidateQueries(queryClient),
  });

  async function saveBearbeiter(bearbeiter: CreateBearbeiterDto) {
    let loggedInBearbeiter = await loginBearbeiter.mutateAsync(bearbeiter);
    console.log('Saving bearbeiter:', bearbeiter, loggedInBearbeiter);
    if (!loggedInBearbeiter.data) {
      console.error('LoggedInBearbeiter is not set. Should not happen');
    }
    setBearbeiter(loggedInBearbeiter.data!!);
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
