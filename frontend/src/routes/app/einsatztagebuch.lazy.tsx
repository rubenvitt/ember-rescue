import { createLazyFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';

export const Route = createLazyFileRoute('/app/einsatztagebuch')({
  component: Einsatztagebuch,
});

function Einsatztagebuch() {
  return <LayoutApp>Einsatztagebuch</LayoutApp>;
}