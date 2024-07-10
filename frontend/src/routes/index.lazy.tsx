import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { bearbeiter } = useBearbeiter();
  let navigate = useNavigate({ from: '/' });

  useEffect(() => {
    if (bearbeiter.isLoading) {
      // do nothing
    } else if (bearbeiter?.data?.id) {
      navigate({ to: '/app' });
    } else {
      navigate({ to: '/signin' });
    }
  }, [bearbeiter.isLoading, navigate]);
}
