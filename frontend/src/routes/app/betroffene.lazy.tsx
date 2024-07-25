import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/betroffene')({
  component: Betroffene,
});

function Betroffene() {
  return <><p className="dark:text-white">Betroffene</p></>;
}