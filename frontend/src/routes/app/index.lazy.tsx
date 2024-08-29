import { createLazyFileRoute } from '@tanstack/react-router';
import { DefaultDashboard } from '../../components/atomic/templates/dashboards/DefaultDashboard.component.js';

export const Route = createLazyFileRoute('/app/')({
  component: App,
  pendingComponent: () => <div>Loading</div>,
});

function App() {
  return <DefaultDashboard />;
}
