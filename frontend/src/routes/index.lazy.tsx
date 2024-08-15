import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';
import { useAppWindow } from '../hooks/window.hook.js';
import { WindowOptions, Windows } from '../utils/window.js';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { bearbeiter } = useBearbeiter({ requireBearbeiter: true });
  let navigate = useNavigate({ from: '/' });
  const openApp = useAppWindow({ appWindow: Windows.APP, windowOptions: WindowOptions.app });

  useEffect(() => {
    if (bearbeiter.isLoading) {
      // do nothing
    } else if (bearbeiter.data?.id) {
      openApp({ closeOnNavigate: true });
    } else {
      navigate({ to: '/auth/signout' });
    }
  }, [bearbeiter.isLoading, navigate]);
}
