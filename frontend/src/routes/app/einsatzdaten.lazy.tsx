import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/einsatzdaten')({
  component: Einsatzdaten,
});

function Einsatzdaten() {
  // let query = useQuery({
  //   queryKey: ['test'],
  //   queryFn: () => new Promise((resolve) => {
  //     setTimeout(() => resolve(`Banana, its ${new Date().toISOString()}`), 2000);
  //   }),
  //   refetchInterval: 1000,theme
  // });
  return <><p className="dark:text-white">Einsatzdaten</p></>;
}