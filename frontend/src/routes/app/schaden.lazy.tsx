import { createLazyFileRoute } from '@tanstack/react-router';
import { useContextualNavigation } from '../../hooks/navigation.hook.js';
import { PiPlus, PiUsers } from 'react-icons/pi';
import { useMemo } from 'react';
import { ContextualNavigation } from '../../types/ui/nav.types.js';

export const Route = createLazyFileRoute('/app/schaden')({
  component: Schaden,
});

function Schaden() {
  useContextualNavigation(useMemo<ContextualNavigation>(() => {
    return {
      title: 'Schäden',
      items: [
        { name: 'Personenschaden', icon: PiPlus, href: '#', current: false },
        { name: 'Sachschaden', icon: PiUsers, href: '#' },
      ],
    };
  }, []));
  return <><p className="dark:text-white">Schäden</p></>;
}