import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { MapboxComponent } from '../../components/atomic/organisms/Mapbox.component.js';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});


function Lagekarte() {
  return <LayoutApp>
    <div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>
      <MapboxComponent />
    </div>
    {/*<div style={{ height: 'calc(100vh - 150px)', width: '100%' }}>*/}
    {/*  <LeafletMap />*/}
    {/*</div>*/}
  </LayoutApp>;
}