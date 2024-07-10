import { createLazyFileRoute } from '@tanstack/react-router';
import { SignIn } from '../components/atomic/templates/SignIn.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/signin')({
  component: SignInRoute,
});

function SignInRoute() {
  const { removeBearbeiter } = useBearbeiter();
  useEffect(() => {
    removeBearbeiter();
  }, []);

  return (
    <SignIn />
  );
}
