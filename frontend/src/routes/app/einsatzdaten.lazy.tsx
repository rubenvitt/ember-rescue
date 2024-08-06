import { createLazyFileRoute } from '@tanstack/react-router';
import { EinsatzdatenForm } from '../../components/atomic/organisms/EinsatzdatenForm.component.js';

export const Route = createLazyFileRoute('/app/einsatzdaten')({
  component: Einsatzdaten,
});

function Einsatzdaten() {
  // here should a form be added that allows the user to modify einsatzdaten
  return <EinsatzdatenForm />;
}