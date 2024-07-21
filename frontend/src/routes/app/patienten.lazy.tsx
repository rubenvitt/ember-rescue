import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';

export const Route = createLazyFileRoute('/app/patienten')({
  component: Patienten,
});

function Patienten() {
  return <LayoutApp><p className="dark:text-white">Patienten</p></LayoutApp>;
}