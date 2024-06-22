import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBearbeiter } from '../../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';

export const Route = createFileRoute('/auth/signout')({
  component: () => {
    const { removeBearbeiter, bearbeiter } = useBearbeiter();
    const navigate = useNavigate();

    useEffect(() => removeBearbeiter(), [removeBearbeiter]);
    useEffect(() => {
      if (!bearbeiter) navigate({ to: '/' });
    }, [navigate, bearbeiter]);

    return <></>;
  },
});
