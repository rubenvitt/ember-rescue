import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/gefahren')({
  component: Gefahren,
});

function Gefahren() {
  return <><p className="dark:text-white">Gefahren</p></>;
}