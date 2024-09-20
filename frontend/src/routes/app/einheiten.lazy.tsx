import { createLazyFileRoute } from '@tanstack/react-router';
import { EinheitenlisteComponent } from '../../components/atomic/organisms/Einheitenliste.component.js';
import { useEinheiten } from '../../hooks/einheiten/einheiten.hook.js';
import { AddEinheiten } from '../../components/atomic/molecules/AddEinheiten.component.js';

export const Route = createLazyFileRoute('/app/einheiten')({
  component: Einheiten,
});

function Einheiten() {
  const { einheitenImEinsatz } = useEinheiten();

  return (
    <>
      <EinheitenlisteComponent einheiten={einheitenImEinsatz.data} />
      <AddEinheiten classNameContainer="mt-12" />
    </>
  );
}
