import { createLazyFileRoute } from '@tanstack/react-router';
import { SignIn } from '../components/atomic/organisms/SignIn.js';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { useEffect, useState } from 'react';
import { useBackend } from '../hooks/backend.hook.js';
import { Id, toast } from 'react-toastify';
import { PiCloudWarning } from 'react-icons/pi';

export const Route = createLazyFileRoute('/signin')({
  component: SignInRoute,
  pendingComponent: () => <div>'Loading...'</div>,
});

function SignInRoute() {
  const { removeBearbeiter } = useBearbeiter();
  const { isAvailable } = useBackend();
  const [toastId, setToastId] = useState<Id>();

  useEffect(() => {
    if (!isAvailable) {
      if (!toastId) {
        // FIXME[ember-rescue-68](rubeen, 11.12.24): toastID not being set
        toast.warning('Backend is not available', { icon: PiCloudWarning, autoClose: false, closeOnClick: false, closeButton: false, theme: 'colored', toastId: 'backend-not-available' });
        setToastId('backend-not-available');
        console.log('toastId', toastId);
      }
    } else {
      console.log('backend is available');
      if (toastId) {
        console.log('toastId', toastId);
        toast.dismiss(toastId);
        setToastId(undefined);
        toast.success('Backend is available', {
          autoClose: 2000,
        });
      }
    }
  }, [isAvailable]);

  useEffect(() => {
    removeBearbeiter();
  }, []);

  return <SignIn />;
}
