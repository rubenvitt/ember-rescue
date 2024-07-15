import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { EinsatztagebuchComponent } from '../../components/atomic/organisms/Einsatztagebuch.component.tsx';
import { useEffect } from 'react';
import { useStore } from '../../hooks/store.hook.js';
import { ClockIcon, PlusIcon } from '@heroicons/react/24/outline';

export const Route = createLazyFileRoute('/app/einsatztagebuch')({
  component: Einsatztagebuch,
});

function Einsatztagebuch() {
  const { setContextualNavigation } = useStore();
  useEffect(() => {
    setContextualNavigation({
      title: 'Einsatztagebuch',
      items: [
        { name: 'Neuen Eintrag anlegen', href: '/app', icon: PlusIcon },
        { name: 'Letzte Einträge', href: '/app/einsatztagebuch/letzte-eintraege', icon: ClockIcon },
      ],
    });

    return () => setContextualNavigation(undefined);
  }, [setContextualNavigation]);

  return <LayoutApp>
    <EinsatztagebuchComponent />
  </LayoutApp>;
}