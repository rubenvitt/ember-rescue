import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useEinsatz } from '../hooks/einsatz.hook.js';
import { SetupEinsatzTemplate } from '../components/atomic/templates/SetupEinsatz.component.js';

export const Route = createLazyFileRoute('/setupEinsatz')({
  component: SetupEinsatz,
  pendingComponent: () => <div>Loading...</div>,
});

function SetupEinsatz() {
  const { einsatz } = useEinsatz();
  const navigate = useNavigate({ from: '/setupEinsatz' });


  useEffect(() => {
    console.log('Maybe navigate to app');
    if (einsatz.isFetched && einsatz.data) {
      console.log('Navigate to app');
      navigate({ to: '/app/' });
    }
  }, [navigate, einsatz.isFetched]);

  return (<SetupEinsatzTemplate />);
}