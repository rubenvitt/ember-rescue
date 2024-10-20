import { createLazyFileRoute } from '@tanstack/react-router';
import { FahrzeugelisteComponent } from '../../components/atomic/organisms/FahrzeugeListe.component.js';
import { useFahrzeuge } from '../../hooks/fahrzeuge/fahrzeuge.hook.js';
import { AddFahrzeuge } from '../../components/atomic/molecules/AddFahrzeuge.component.js';

export const Route = createLazyFileRoute('/app/fahrzeuge')({
  component: Fahrzeuge,
});

function Fahrzeuge() {
  const { fahrzeugeImEinsatz } = useFahrzeuge();

  return (
    <>
      <FahrzeugelisteComponent fahrzeuge={fahrzeugeImEinsatz.data} />
      <AddFahrzeuge classNameContainer="mt-12" />
    </>
  );
}
