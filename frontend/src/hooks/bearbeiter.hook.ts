import { useStore } from './store.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { useNavigate } from '@tanstack/react-router';

type Props = {
  requireBearbeiter?: boolean;
}

export function useBearbeiter({ requireBearbeiter }: Props = {}) {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const allBearbeiter = useQuery<Bearbeiter[]>({
    queryKey: ['bearbeiter'],
    queryFn: async () => {
      return await fetch('http://localhost:3000/bearbeiter').then((res) => res.json());
    },
  });

  const navigate = useNavigate();

  const singleBearbeiter = useQuery<Bearbeiter, unknown, Bearbeiter>({
    queryKey: ['bearbeiter', bearbeiter?.id],
    queryFn: async () => {
      if (!bearbeiter?.id) return Promise.resolve(null);
      console.log('Fetching bearbeiter:', bearbeiter);
      return await fetch(`http://localhost:3000/bearbeiter/${bearbeiter?.id}`).then((res) => {
        if (!res.ok) throw new Error('Bearbeiter not found');
        return res.json();
      }).catch(() => {
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
    mutationKey: ['bearbeiter'],
    mutationFn: async (bearbeiter) => {
      return await fetch('http://localhost:3000/bearbeiter', {
        method: 'POST',
        body: JSON.stringify(bearbeiter),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json() as Promise<Bearbeiter>);
    },
  });

  async function saveBearbeiter(bearbeiter: Bearbeiter | NewBearbeiter) {
    let loggedInBearbeiter = await loginBearbeiter.mutateAsync(bearbeiter);
    console.log('Saving bearbeiter:', bearbeiter, loggedInBearbeiter);
    setBearbeiter(loggedInBearbeiter);
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