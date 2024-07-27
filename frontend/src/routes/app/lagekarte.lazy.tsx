import { createLazyFileRoute } from '@tanstack/react-router';
import { MapboxComponent } from '../../components/atomic/organisms/Mapbox.component.js';
import { useMemo } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline/index.js';
import { PiCloud } from 'react-icons/pi';
import { ContextualNavigation } from '../../types/ui/nav.types.js';
import { useContextualNavigation } from '../../hooks/navigation.hook.js';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});


function Lagekarte() {
  useContextualNavigation(useMemo<ContextualNavigation>(() => {
    return {
      title: 'Einsatztagebuch',
      items: [
        { name: 'Letzte Einträge', href: '/app/einsatztagebuch/letzte-eintraege', icon: ClockIcon },
        { name: 'DWD Wetterkarte', href: '/app', icon: PiCloud },
      ],
    };
  }, []));

  return <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
    <MapboxComponent />
  </div>;
  /*<div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>*/

  /*  <LeafletMap />*/
  /*</div>*/
}