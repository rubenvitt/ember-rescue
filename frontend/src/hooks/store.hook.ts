import { create } from 'zustand';
import storage from '../utils/storage.js';
import { BearbeiterDto, SmallMissionDto } from '@ember-rescue/shared/client/index.js';

type Store = {
  bearbeiter: BearbeiterDto | null;
  setBearbeiter: (bearbeiter: BearbeiterDto) => void;
  removeBearbeiter: () => void;

  einsatzId: string | null;
  setEinsatz: (einsatz: SmallMissionDto) => void;
  removeEinsatz: () => void;

  theme: {
    dark: boolean;
    setDark: (dark: ((old: boolean) => boolean) | boolean) => void;
    setAuto: (dark?: boolean) => void;
  };
};

export const useStore = create<Store>((set, get) => ({
  bearbeiter: storage().readLocalStorage<BearbeiterDto>('bearbeiter'),
  setBearbeiter: (bearbeiter: BearbeiterDto) => {
    storage().writeLocalStorage('bearbeiter', bearbeiter);
    set({ bearbeiter });
  },
  removeBearbeiter: () => {
    storage().writeLocalStorage('bearbeiter', null);
    storage().writeLocalStorage('mission', null);
    set({ bearbeiter: null, einsatzId: null });
  },

  einsatzId: storage().readLocalStorage<string>('mission'),
  setEinsatz: (einsatz: SmallMissionDto) => {
    storage().writeLocalStorage('mission', einsatz.id);
    set({ einsatzId: einsatz.id });
  },
  removeEinsatz: () => {
    storage().writeLocalStorage('mission', null);
    set({ einsatzId: null });
  },

  theme: {
    dark:
      storage().readLocalStorage<boolean>('theme:dark') ?? window.matchMedia('(prefers-color-scheme: dark)').matches,
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
