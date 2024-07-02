import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { LayoutApp } from '../_layout/_layout-app.js';
import { useEinsatz } from '../../hooks/einsatz.hook.js';
import { useMemo } from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { format } from 'date-fns';
import { natoDateTime } from '../../lib/time.js';

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

  if (!einsatz) {
    navigate({ to: '/setupEinsatz' });
  }

  return <LayoutApp>Aktueller
    Einsatz: {einsatz?.einsatz_alarmstichwort?.bezeichnung} von {format(einsatz.beginn, natoDateTime)}</LayoutApp>;
}
