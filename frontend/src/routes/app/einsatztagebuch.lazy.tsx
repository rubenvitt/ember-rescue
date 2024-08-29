import { createLazyFileRoute } from '@tanstack/react-router';
import { EinsatztagebuchComponent } from '../../components/atomic/organisms/Einsatztagebuch.component.tsx';

export const Route = createLazyFileRoute('/app/einsatztagebuch')({
  component: Einsatztagebuch,
});

function Einsatztagebuch() {
  return <EinsatztagebuchComponent />;
}