import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { useEinsatz } from '../../hooks/einsatz.hook.js';
import { useEffect, useMemo } from 'react';
import { getCurrent } from '@tauri-apps/api/window';

export const Route = createLazyFileRoute('/app/')({
  component: App,
});

function App() {
  const { einsatz } = useEinsatz();
  const navigate = useNavigate({ from: '/app/' });

  useMemo(async () => {
    const window = getCurrent();
    await window.setTitle('Project Rescue');
    await window.setFullscreen(true);
    await window.setResizable(true);
    await window.setAlwaysOnTop(false);
  }, []);

  useEffect(() => {
    if (einsatz.isLoading) {
      // do nothing
    } else if (!einsatz.data) {
      navigate({ to: '/setupEinsatz' });
    }
  }, [einsatz, navigate]);

  return <LayoutApp>Das is app yo</LayoutApp>;
}
