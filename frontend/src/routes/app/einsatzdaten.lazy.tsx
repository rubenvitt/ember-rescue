import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/einsatzdaten')({
  component: Einsatzdaten,
});

function Einsatzdaten() {
  // here should a form be added that allows the user to modify einsatzdaten
  return <><p className="dark:text-white">Einsatzdaten</p></>;
}