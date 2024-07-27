import { create } from 'zustand';
import storage from '../utils/storage.js';
import { ContextualNavigation } from '../types/ui/nav.types.js';
import { Einsatz } from '../types/app/einsatz.types.js';
import { Bearbeiter } from '../types/app/bearbeiter.types.js';

type Store = {
  bearbeiter: Bearbeiter | null;
  setBearbeiter: (bearbeiter: Bearbeiter) => void;
  removeBearbeiter: () => void;

  einsatzId: string | null;
  setEinsatz: (einsatz: Einsatz) => void;
  removeEinsatz: () => void;

  theme: {
    dark: boolean;
    setDark: (dark: ((old: boolean) => boolean) | boolean) => void;
    setAuto: (dark?: boolean) => void;
  }

  contextualNavigation?: ContextualNavigation;
  setContextualNavigation: (contextualNavigation: ContextualNavigation | undefined) => void;
}

export const useStore = create<Store>((set, get) => ({
  bearbeiter: storage().readLocalStorage<Bearbeiter>('bearbeiter'),
  setBearbeiter: (bearbeiter: Bearbeiter) => {
    storage().writeLocalStorage('bearbeiter', bearbeiter);
    set({ bearbeiter });
  },
  removeBearbeiter: () => {
    storage().writeLocalStorage('bearbeiter', null);
    storage().writeLocalStorage('einsatz', null);
    set({ bearbeiter: null, einsatzId: null });
  },

  einsatzId: storage().readLocalStorage<string>('einsatz'),
  setEinsatz: (einsatz: Einsatz) => {
    storage().writeLocalStorage('einsatz', einsatz.id);
    set({ einsatzId: einsatz.id });
  },
  removeEinsatz: () => {
    storage().writeLocalStorage('einsatz', null);
    set({ einsatzId: null });
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


  setContextualNavigation: (contextualNavigation) => set({ contextualNavigation }),
}));