import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';

export const Route = createLazyFileRoute('/app/kraefte')({
  component: Kraefte,
});

function Kraefte() {
  return <LayoutApp>Kräfte</LayoutApp>;
}