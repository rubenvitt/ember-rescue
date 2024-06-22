import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { useQuery } from '@tanstack/react-query';

export const Route = createLazyFileRoute('/app/einsatzdaten')({
  component: Einsatzdaten,
});

function Einsatzdaten() {
  let query = useQuery({
    queryKey: ['test'],
    queryFn: () => new Promise((resolve) => {
      setTimeout(() => resolve(`Banana, its ${new Date().toISOString()}`), 2000);
    }),
    refetchInterval: 1000,
  });
  return <LayoutApp>Einsatzdaten</LayoutApp>;
}