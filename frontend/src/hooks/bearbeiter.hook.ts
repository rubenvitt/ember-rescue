import { useStore } from './store.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types.js';

export function useBearbeiter() {
  const { setBearbeiter, bearbeiter, removeBearbeiter } = useStore();

  function saveBearbeiter(bearbeiter: Bearbeiter | NewBearbeiter) {
    if (bearbeiter.id === null) {
      console.debug('Creating new bearbeiter:', bearbeiter);
      setBearbeiter({ ...bearbeiter, id: Math.random().toString(36).substring(7) });
    } else {
      console.log('Saving bearbeiter:', bearbeiter);
      setBearbeiter(bearbeiter);
    }
  }

  function remove() {
    removeBearbeiter();
  }

  return { bearbeiter, saveBearbeiter, removeBearbeiter: remove };
}