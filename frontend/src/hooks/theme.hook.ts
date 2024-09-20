import { useCallback, useContext, useEffect } from 'react';
import { ThemeContext } from '../components/atomic/atoms/Theme.component.js';
import { useStore } from './store.hook.js';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function _useTheme() {
  const {
    theme: { dark, setDark, setAuto },
  } = useStore();

  const handleColorSchemeChange = useCallback(
    (e: MediaQueryListEvent) => {
      setAuto(e.matches);
    },
    [setAuto],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, [handleColorSchemeChange]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((prevDark) => !prevDark);
  }, [setDark]);

  return {
    theme: dark ? 'dark' : ('light' as Theme),
    isDark: dark,
    setIsDark: setDark,
    setAutoTheme: setAuto,
    toggleTheme: toggle,
  };
}
