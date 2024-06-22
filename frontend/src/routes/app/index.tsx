import { createFileRoute } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';

export const Route = createFileRoute('/app/')({
  component: App,
});

function App() {
  return <LayoutApp>Das is app yo</LayoutApp>;
}
