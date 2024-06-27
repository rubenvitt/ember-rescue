import { useStore } from './store.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

export function useBearbeiter() {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();
  const allBearbeiter = useQuery<Bearbeiter[]>({
    queryKey: ['bearbeiter'],
    refetchOnWindowFocus: true,
    queryFn: async () => {
      return await fetch('http://localhost:3000/bearbeiter').then((res) => res.json());
    },
  });

  let { mutateAsync: loginBearbeiter } = useMutation<Bearbeiter, unknown, Bearbeiter | NewBearbeiter>({
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
    let loggedInBearbeiter = await loginBearbeiter(bearbeiter);
    console.log('Saving bearbeiter:', bearbeiter, loggedInBearbeiter);
    setBearbeiter(loggedInBearbeiter);
  }

  function remove() {
    console.log('Removing bearbeiter:', bearbeiter);
    removeBearbeiter();
  }

  return { bearbeiter, saveBearbeiter, removeBearbeiter: remove, allBearbeiter };
}