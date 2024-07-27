import { createLazyFileRoute } from '@tanstack/react-router';
import { EinsatztagebuchComponent } from '../../components/atomic/organisms/Einsatztagebuch.component.tsx';
import { useContextualNavigation } from '../../hooks/navigation.hook.js';
import { useMemo } from 'react';
import { ContextualNavigation } from '../../types/nav.types.js';
import { PiCloud, PiPlus } from 'react-icons/pi';

export const Route = createLazyFileRoute('/app/einsatztagebuch')({
  component: Einsatztagebuch,
});

function Einsatztagebuch() {
  useContextualNavigation(useMemo<ContextualNavigation>(() => {
    return {
      title: 'Einsatztagebuch',
      items: [
        { name: 'Neuen Eintrag anlegen', href: '/app', icon: PiPlus },
        { name: 'Letzte Einträge', href: '/app', icon: PiCloud },
      ],
    };
  }, []));

  return <EinsatztagebuchComponent />;
}