import { createFileRoute } from '@tanstack/react-router';
import { useBearbeiter } from '../../hooks/bearbeiter.hook.js';
import { useEffect } from 'react';
import { WindowOptions, Windows } from '../../utils/window.js';
import { useAppWindow } from '../../hooks/window.hook.js';

export const Route = createFileRoute('/auth/signout')({
  component: () => {
    const { bearbeiter } = useBearbeiter();
    const openSignin = useAppWindow({
      // @ts-ignore
      windowOptions: { ...WindowOptions.main, size: undefined },
      appWindow: Windows.MAIN,
    });

    useEffect(() => {
      if (bearbeiter.isLoading) return;
      openSignin({ closeOnNavigate: true });
    }, [bearbeiter.data]);

    return <></>;
  }
});