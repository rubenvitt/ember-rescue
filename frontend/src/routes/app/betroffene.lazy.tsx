import { createLazyFileRoute } from '@tanstack/react-router';
import { useContextualNavigation } from '../../hooks/navigation.hook.js';
import { PiPlus, PiUsers } from 'react-icons/pi';
import { useMemo } from 'react';
import { ContextualNavigation } from '../../types/ui/nav.types.js';

export const Route = createLazyFileRoute('/app/betroffene')({
  component: Betroffene,
});

function Betroffene() {
  useContextualNavigation(useMemo<ContextualNavigation>(() => {
    return {
      title: 'Betroffene',
      items: [
        { name: 'Betroffene aufnehmen', icon: PiPlus, href: '#' },
        { name: 'Betroffene verwalten', icon: PiUsers, href: '#' },
      ],
    };
  }, []));
  return <><p className="dark:text-white">Betroffene</p></>;
}