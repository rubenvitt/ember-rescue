import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEinsatz } from '../../hooks/einsatz.hook.js';
import { getCurrent } from '@tauri-apps/api/window';
import { format } from 'date-fns';
import { natoDateTime } from '../../utils/time.js';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/app/')({
  component: App,
  pendingComponent: () => <div>Loading</div>,
});

function App() {
  const { einsatz } = useEinsatz();
  const navigate = useNavigate({ from: '/app/' });

  useEffect(() => {
    const setupWindow = async () => {
      const window = getCurrent();
      await window.setTitle('Project Rescue');
      await window.setFullscreen(true);
      await window.setResizable(true);
      await window.setAlwaysOnTop(false);
    };

    setupWindow();
  }, []);

  useEffect(() => {
    if (einsatz.isDisabled) navigate({ to: '/setupEinsatz' });
  }, [einsatz.isDisabled]);

  if (einsatz.isLoading)
    return null;

  const data = einsatz.data;
  if (data) {
    return <>
      <p className="text-gray-900 dark:text-white">
        Aktueller Einsatz: {data.einsatz_alarmstichwort?.bezeichnung} von {format(data.beginn, natoDateTime)}
      </p>
      <p className="text-gray-500">
        {data.einsatz_alarmstichwort?.beschreibung}
      </p>
    </>;
  }
}
