import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { EinsatztagebuchComponent } from '../../components/atomic/organisms/Einsatztagebuch.component.tsx';

export const Route = createLazyFileRoute('/app/einsatztagebuch')({
  component: Einsatztagebuch,
});

function Einsatztagebuch() {
  return <LayoutApp>
    <EinsatztagebuchComponent />
  </LayoutApp>;
}