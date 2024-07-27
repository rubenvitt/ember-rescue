import { useEffect } from 'react';
import { useStore } from './store.hook.js';
import { ContextualNavigation } from '../types/nav.types.js';

export function useContextualNavigation(contextualNavigationProps: ContextualNavigation | undefined) {
  const { setContextualNavigation } = useStore();

  useEffect(() => {
    setContextualNavigation(contextualNavigationProps);

    return () => setContextualNavigation(undefined);
  }, [setContextualNavigation, contextualNavigationProps]);
}