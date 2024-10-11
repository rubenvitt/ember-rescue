import { createLazyFileRoute } from '@tanstack/react-router';
import { EinsatzdatenForm } from '../../components/atomic/organisms/EinsatzdatenForm.component.js';
import { useSecret } from '../../hooks/secrets.hook.js';

export const Route = createLazyFileRoute('/app/einsatzdaten')({
  component: Einsatzdaten,
});

function Einsatzdaten() {
  // here should a form be added that allows the user to modify einsatzdaten
  const { secret } = useSecret({ secretKey: 'mapboxApi' });
  if (secret.isLoading) {
    return <div>Loading...</div>;
  }
  return <EinsatzdatenForm mapboxApiKey={secret.data} />;
}
