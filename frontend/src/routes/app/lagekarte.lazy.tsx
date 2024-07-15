import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { MapboxComponent } from '../../components/atomic/organisms/Mapbox.component.js';
import { useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline/index.js';
import { useStore } from '../../hooks/store.hook.js';
import { PiCloud } from 'react-icons/pi';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});


function Lagekarte() {
  let { setContextualNavigation } = useStore();

  useEffect(() => {
    setContextualNavigation({
      title: 'Einsatztagebuch',
      items: [
        { name: 'Letzte Einträge', href: '/app/einsatztagebuch/letzte-eintraege', icon: ClockIcon },
        { name: 'DWD Wetterkarte', href: '/app', icon: PiCloud },
      ],
    });

    return () => setContextualNavigation(undefined);
  }, [setContextualNavigation]);

  return <LayoutApp>
    <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <MapboxComponent />
    </div>
    {/*<div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>*/}
    {/*  <LeafletMap />*/}
    {/*</div>*/}
  </LayoutApp>;
}