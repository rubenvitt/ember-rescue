import React, { useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PiGear, PiSecurityCamera } from 'react-icons/pi';
import { cva } from 'class-variance-authority';
import { useWindowSetup } from '../../../hooks/window.hook.ts';
import { WindowOptions } from '../../../utils/window.js';
import { useModal } from '../../../hooks/modal.hook.js';
import { GenericForm } from './GenericForm.component.js';
import storage from '../../../utils/storage.js';
import { Button, Image } from 'antd';
import { LoginForm } from '../molecules/LoginForm.component.tsx';


export const SignIn: React.FC = () => {
    const navigate = useNavigate({ from: '/signin' });

    useWindowSetup(WindowOptions.main);
    const navigateToSettings = useCallback(() => navigate({ to: '/prestart/settings' }), [navigate]);

    const { closeModal, openModal, isOpen } = useModal();
    useEffect(() => {
      const handleRequestAccessToken = () => {
        console.log('Request Access Token', { isOpen });
        if (!isOpen) {
          openModal({
            title: 'Access Token',
            content: <GenericForm<{ accessToken: string }>
              onSubmit={(data) => {
                storage().writeLocalStorage('backendAccessToken', data.accessToken);
                closeModal();
                window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
              }}
              onReset={async () => {
                await navigateToSettings();
                window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
                closeModal();
              }}
              // FIXME: verliert bei jedem Event(?) den Fokus.
              field={{
                label: 'Access Token Required',
                name: 'accessToken',
                type: 'password',
              }}
              submitText={'Speichern'}
              submitIcon={PiSecurityCamera}
              resetText={'Abbrechen'}
            />,
          });
          storage().writeLocalStorage('backendAccessToken', null);
        }
      };
      window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
      return () => {
        window.removeEventListener('requestAccessToken', handleRequestAccessToken);
      };
    }, []);

    // TODO[ant-design](rubeen, 15.08.24): remove this code
    // const formSubmit = useCallback(({ value }: { value: { bearbeiter: Bearbeiter | CreateBearbeiter } }) =>
    //     saveBearbeiter(value.bearbeiter).then(() => openApp({ closeOnNavigate: true })),
    //   [saveBearbeiter, navigate]);
    //
    // const form = useForm<{ bearbeiter: Bearbeiter | CreateBearbeiter }>({
    //   defaultValues: { bearbeiter: { name: '', id: null } },
    //   onSubmit: formSubmit,
    // });

    return (
      <div className={cva('flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative')()}>
        <div className="absolute top-4 right-4">
          <Button
            onClick={navigateToSettings}
            shape="circle"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Einstellungen"
            icon={<PiGear />}
            size="large"
            type="text"
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col">
          <Image src="/logo.png" preview={false} wrapperClassName="bg-green-500 w-36 mx-auto h-36"
                 alt="EmberRescue Logo" />
          <h2
            className={cva('mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white')()}>Project
            Rescue • Anmelden</h2>
        </div>
        <div className={'mt-10 sm:mx-auto sm:w-full sm:max-w-sm'}>
          <LoginForm />
        </div>
      </div>
    )
      ;
  }
;