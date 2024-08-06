import { createLazyFileRoute } from '@tanstack/react-router';
import { MapboxComponent } from '../../components/atomic/organisms/Mapbox.component.js';
import { useMemo } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline/index.js';
import { PiCloud } from 'react-icons/pi';
import { ContextualNavigation } from '../../types/ui/nav.types.js';
import { useContextualNavigation } from '../../hooks/navigation.hook.js';
import { useSecret } from '../../hooks/secrets.hook.js';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});


function Lagekarte() {
  const { secret } = useSecret({ secretKey: 'mapboxApi' });
  useContextualNavigation(useMemo<ContextualNavigation>(() => {
    return {
      title: 'Einsatztagebuch',
      items: [
        { name: 'Letzte Einträge', href: '/app/einsatztagebuch/letzte-eintraege', icon: ClockIcon },
        { name: 'DWD Wetterkarte', href: '/app', icon: PiCloud },
      ],
    };
  }, []));

  if (secret.isLoading) {
    return null;
  }

  if (!secret.data?.value) {
    return <div>Missing Mapbox Key</div>
  }

  return <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
    <MapboxComponent mapboxToken={secret.data.value} />
  </div>;
  /*<div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>*/

  /*  <LeafletMap />*/
  /*</div>*/
}