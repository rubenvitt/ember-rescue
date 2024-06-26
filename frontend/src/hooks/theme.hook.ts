import { useStore } from './store.hook.js';
import { useEffect } from 'react';

export function useTheme() {
  let { theme: { dark, setDark, setAuto } } = useStore();

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setAuto(e.matches);
    });

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', (e) => {
        setAuto(e.matches);
      });
    };
  }, []);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  function toggle() {
    setDark((old) => !old);
  }

  return {
    theme: dark ? 'dark' : 'light',
    dark,
    setDark,
    setAuto,
    toggle,
  };
}