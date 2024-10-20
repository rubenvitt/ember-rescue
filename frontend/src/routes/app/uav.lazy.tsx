import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/app/uav')({
  component: UAV,
});

function UAV() {
  return (
    <>
      <p>8? Kacheln mit Daten wie in der UAV-App. Eine Lagekarte und Wetterforecast.</p>
      <p>Schnelleingabe für Flüge + Tabelle vergangener Flüge.</p>
    </>
  );
}
