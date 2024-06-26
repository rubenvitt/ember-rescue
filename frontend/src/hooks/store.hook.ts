import { create } from 'zustand';
import { Bearbeiter } from '../types.js';
import storage from '../lib/storage.js';

type Store = {
  bearbeiter: Bearbeiter | null;
  setBearbeiter: (bearbeiter: Bearbeiter) => void;
  removeBearbeiter: () => void;

  theme: {
    dark: boolean;
    setDark: (dark: ((old: boolean) => boolean) | boolean) => void;
    setAuto: (dark?: boolean) => void;
  }
}

export const useStore = create<Store>((set, get) => ({
  bearbeiter: storage().readLocalStorage<Bearbeiter>('bearbeiter'),
  setBearbeiter: (bearbeiter: Bearbeiter) => {
    storage().writeLocalStorage('bearbeiter', bearbeiter);
    set({ bearbeiter });
  },
  removeBearbeiter: () => {
    storage().writeLocalStorage('bearbeiter', null);
    set({ bearbeiter: null });
  },
  theme: {
    dark: storage().readLocalStorage<boolean>('theme:dark') ?? window.matchMedia('(prefers-color-scheme: dark)').matches,
    setDark: (dark) => {
      let isDark = typeof dark === 'function' ? dark(get().theme.dark) : dark;
      storage().writeLocalStorage('theme:dark', isDark);
      set((state) => ({ theme: { ...state.theme, dark: isDark } }));
    },
    setAuto: (dark) => {
      storage().writeLocalStorage('theme:dark', null);
      set((state) => ({
        theme: {
          ...state.theme,
          dark: dark ?? window.matchMedia('(prefers-color-scheme: dark)').matches,
        },
      }));
    },
  },
}));