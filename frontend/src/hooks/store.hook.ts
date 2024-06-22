import { create } from 'zustand';
import { Bearbeiter } from '../types.js';
import storage from '../lib/storage.js';

type Store = {
  bearbeiter: Bearbeiter | null;
  setBearbeiter: (bearbeiter: Bearbeiter) => void;
  removeBearbeiter: () => void;
}

export const useStore = create<Store>((set) => ({
  bearbeiter: storage().readLocalStorage<Bearbeiter>('bearbeiter'),
  setBearbeiter: (bearbeiter: Bearbeiter) => {
    storage().writeLocalStorage('bearbeiter', bearbeiter);
    set({ bearbeiter });
  },
  removeBearbeiter: () => {
    storage().writeLocalStorage('bearbeiter', null);
    set({ bearbeiter: null });
  },
}));