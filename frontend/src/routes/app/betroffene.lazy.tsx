import { createLazyFileRoute } from '@tanstack/react-router';
import { BetroffeneTemplate } from '../../components/atomic/templates/Betroffene.component.js';

export const Route = createLazyFileRoute('/app/betroffene')({
  component: Betroffene,
});

function Betroffene() {
  return <BetroffeneTemplate />;
}
