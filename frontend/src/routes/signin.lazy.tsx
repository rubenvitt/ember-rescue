import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { SignIn } from '../templates/SignIn.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/signin')({
  component: SignInRoute,
});

function SignInRoute() {
  const { bearbeiter } = useBearbeiter();
  let navigate = useNavigate({ from: '/signin' });

  useEffect(() => {
    if (bearbeiter?.id) {
      navigate({ to: '/app/' });
    }
  });

  return (
    <SignIn />
  );
}
