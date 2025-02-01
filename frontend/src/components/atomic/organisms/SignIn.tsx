import { useNavigate } from '@tanstack/react-router';
import { getVersion } from '@tauri-apps/api/app';
import { isTauri } from '@tauri-apps/api/core';
import { Button, Form, Image, Input, Modal } from 'antd';
import { cva } from 'class-variance-authority';
import React, { useCallback, useEffect, useState } from 'react';
import { PiGear, PiSecurityCamera, PiSkipBack } from 'react-icons/pi';
import { useWindowSetup } from '../../../hooks/window.hook.ts';
import storage from '../../../utils/storage.js';
import { WindowOptions } from '../../../utils/window.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { LoginForm } from '../molecules/LoginForm.component.tsx';
import { FormLayout } from './form/FormLayout.comonent.js';
import { LocalSettings } from './PrestartSettings.component.tsx';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'unknown';

export const SignIn: React.FC = () => {
  const navigate = useNavigate({ from: '/signin' });
  const [modalForm] = Form.useForm();
  const [version, setVersion] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useWindowSetup(WindowOptions.main);
  const navigateToSettings = useCallback(() => navigate({ to: '/prestart/settings' }), [navigate]);

  useEffect(() => {
    setVersion(isTauri() ? getVersion() : APP_VERSION);
  }, []);

  const handleRequestAccessToken = useCallback(() => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      storage().writeLocalStorage('backendAccessToken', null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handler = () => handleRequestAccessToken();
    window.addEventListener('requestAccessToken', handler);
    return () => {
      window.removeEventListener('requestAccessToken', handler);
    };
  }, [handleRequestAccessToken]);

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
        <div className="hidden dark:block w-36 mx-auto h-36 relative">
          <Image src="/brandbook/mobile-white.png" preview={false} wrapperClassName="h-full w-full" alt="Bluelight Hub Logo" />
        </div>
        <div className="block dark:hidden w-36 mx-auto h-36 relative">
          <Image src="/brandbook/mobile-logo.png" preview={false} wrapperClassName="h-full w-full" alt="Bluelight Hub Logo" />
        </div>
        <h2 className={cva('mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white')()}>Bluelight Hub • Anmelden</h2>
      </div>
      <div className={'mt-10 sm:mx-auto sm:w-full sm:max-w-sm'}>
        <LoginForm />
      </div>

      <FormLayout<{ accessToken: string }>
        formInstance={modalForm}
        form={{
          onFinish: async (values) => {
            storage().writeLocalStorage('backendAccessToken', values.accessToken);
            setIsModalOpen(false);
            modalForm.resetFields();
            window.location.reload();
          },
          onReset: async () => {
            await navigateToSettings();
            setIsModalOpen(false);
            modalForm.resetFields();

            const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');
            if (localSettings) {
              const { baseUrl, ...rest } = localSettings;
              storage().writeLocalStorage('localSettings', rest);
            }
          },
        }}
      >
        {() => (
          <Modal
            onCancel={() => {
              const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');
              if (localSettings) {
                const { baseUrl, ...rest } = localSettings;
                storage().writeLocalStorage('localSettings', rest);
              }
              modalForm.resetFields();
              setIsModalOpen(false);
            }}
            okText="Speichern"
            okButtonProps={{
              icon: <PiSecurityCamera />,
            }}
            cancelButtonProps={{
              icon: <PiSkipBack />,
            }}
            onOk={() => modalForm.submit()}
            open={isModalOpen}
            title="Access Token"
          >
            <InputWrapper name="accessToken">
              <Input.Password autoFocus={true} size="large" placeholder="Access Token benötigt" />
            </InputWrapper>
          </Modal>
        )}
      </FormLayout>

      <div className="mt-8 text-center text-gray-500 text-sm">
        Version {version}
      </div>
    </div>
  );
};
