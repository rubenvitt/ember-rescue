import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '../components/atomic/templates/AppLayout.js';

export const Route = createFileRoute('/app')({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});
