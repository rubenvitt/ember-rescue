import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';

export const Route = createLazyFileRoute('/app/lagekarte')({
  component: Lagekarte,
});

function Lagekarte() {
  return <LayoutApp>Das is app yo</LayoutApp>;
}