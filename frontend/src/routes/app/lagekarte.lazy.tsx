import { createLazyFileRoute } from '@tanstack/react-router';
import { MapboxComponent } from '../../components/atomic/organisms/Mapbox.component.js';
import { useSecret } from '../../hooks/secrets.hook.js';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});


function Lagekarte() {
  const { secret } = useSecret({ secretKey: 'mapboxApi' });

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