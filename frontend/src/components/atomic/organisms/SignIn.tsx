import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PiGear, PiSecurityCamera, PiSkipBack } from 'react-icons/pi';
import { cva } from 'class-variance-authority';
import { useWindowSetup } from '../../../hooks/window.hook.ts';
import { WindowOptions } from '../../../utils/window.js';
import storage from '../../../utils/storage.js';
import { Button, Image, Modal } from 'antd';
import { LoginForm } from '../molecules/LoginForm.component.tsx';
import { FormLayout } from './form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { Input } from 'formik-antd';

export const SignIn: React.FC = () => {
  const navigate = useNavigate({ from: '/signin' });

  useWindowSetup(WindowOptions.main);
  const navigateToSettings = useCallback(() => navigate({ to: '/prestart/settings' }), [navigate]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const password = useRef<HTMLInputElement | null>(null);

  const handleRequestAccessToken = useCallback(() => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      setTimeout(() => {
        password.current?.focus();
      }, 100);
      storage().writeLocalStorage('backendAccessToken', null);
    }
  }, [setIsModalOpen]);

  useEffect(() => {
    window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
    return () => {
      window.removeEventListener('requestAccessToken', handleRequestAccessToken);
    };
  }, []);

  return (
    <div className={cva('relative flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8')()}>
      <div className="absolute right-4 top-4">
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
      <div className="flex flex-col sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/logo.png"
          preview={false}
          wrapperClassName="bg-green-500 w-36 mx-auto h-36"
          alt="EmberRescue Logo"
        />
        <h2
          className={cva(
            'mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white',
          )()}
        >
          Project Rescue • Anmelden
        </h2>
      </div>
      <div className={'mt-10 sm:mx-auto sm:w-full sm:max-w-sm'}>
        <LoginForm />
      </div>

      <FormLayout<{ accessToken: string }>
        formik={{
          initialValues: { accessToken: '' },
          onSubmit: (data) => {
            storage().writeLocalStorage('backendAccessToken', data.accessToken);
            setIsModalOpen(false);
            window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
          },
          onReset: async () => {
            await navigateToSettings();
            window.addEventListener('requestAccessToken', handleRequestAccessToken, { once: true });
            setIsModalOpen(false);
          },
        }}
      >
        {(props) => (
          <Modal
            onClose={() => props.resetForm()}
            onCancel={() => props.resetForm()}
            okText="Speichern"
            okButtonProps={{
              icon: <PiSecurityCamera />,
            }}
            cancelButtonProps={{
              icon: <PiSkipBack />,
            }}
            onOk={props.submitForm}
            open={isModalOpen}
            title="Access Token"
          >
            <InputWrapper name="accessToken">
              <Input.Password
                ref={password}
                autoFocus={true}
                size="large"
                placeholder="Access Token benötigt"
                name="accessToken"
              />
            </InputWrapper>
          </Modal>
        )}
      </FormLayout>
    </div>
  );
};
