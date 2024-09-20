import { createLazyFileRoute } from '@tanstack/react-router';
import { SignIn } from '../components/atomic/organisms/SignIn.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/signin')({
  component: SignInRoute,
  pendingComponent: () => <div>'Loading...'</div>,
});

function SignInRoute() {
  const { removeBearbeiter } = useBearbeiter();
  useEffect(() => {
    removeBearbeiter();
  }, []);

  return <SignIn />;
}
