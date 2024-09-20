import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/schaden')({
  component: Schaden,
});

function Schaden() {
  return (
    <>
      <p className="dark:text-white">Schäden</p>
    </>
  );
}
