import React, { useCallback, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { ComboInput, ItemType } from '../molecules/Combobox.component.js';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Button } from '../molecules/Button.component.tsx';
import { PiGear, PiSecurityCamera } from 'react-icons/pi';
import { cva } from 'class-variance-authority';
import { useAppWindow, useWindowSetup } from '../../../hooks/window.hook.ts';
import { LogicalSize } from '@tauri-apps/api/window';
import { WindowOptions, Windows } from '../../../utils/window.js';
import { Bearbeiter, CreateBearbeiter } from '../../../types/app/bearbeiter.types.js';
import { webviewWindow } from '@tauri-apps/api';
import { useModal } from '../../../hooks/modal.hook.js';
import { GenericForm } from './GenericForm.component.js';
import storage from '../../../utils/storage.js';
import { isTauri } from '@tauri-apps/api/core';


export const SignIn: React.FC = () => {
    const { saveBearbeiter, allBearbeiter } = useBearbeiter();
    const navigate = useNavigate({ from: '/signin' });
    const openApp = useAppWindow({
      appWindow: Windows.APP,
      windowOptions: WindowOptions.app,
    });
    const allBearbeiterItems = React.useMemo<ItemType<Bearbeiter>[]>(() =>
        allBearbeiter.data?.map((item: Bearbeiter) => ({
          label: item.name,
          item,
        })) ?? [],
      [allBearbeiter.data]);
    useEffect(() => {
      if (isTauri()) console.log('My Window is', webviewWindow.getCurrentWebviewWindow());
    }, []);

    useWindowSetup({
      title: `Project Rescue • Anmelden ${isTauri() && webviewWindow.getCurrentWebviewWindow().label}`,
      alwaysOnTop: true,
      center: true,
      resizable: false,
      size: new LogicalSize(400, 600),
    });
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
                closeModal()
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

    const formSubmit = useCallback(({ value }: { value: { bearbeiter: Bearbeiter | CreateBearbeiter } }) =>
        saveBearbeiter(value.bearbeiter).then(() => openApp({ closeOnNavigate: true })),
      [saveBearbeiter, navigate]);

    const form = useForm<{ bearbeiter: Bearbeiter | CreateBearbeiter }>({
      defaultValues: { bearbeiter: { name: '', id: null } },
      onSubmit: formSubmit,
    });

    return (
      <div className={cva('flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative')()}>
        <div className="absolute top-4 right-4">
          <Button
            onClick={navigateToSettings}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Einstellungen"
            icon={PiGear}
            iconSize="lg"
          />
        </div>
        <div className={cva('sm:mx-auto sm:w-full sm:max-w-sm')()}>
          <img className={cva('mx-auto h-36 w-auto')()} src="/logo.png" alt="Project Rescue Logo" />
          <h2
            className={cva('mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white')()}>Project
            Rescue • Anmelden</h2>
        </div>
        <div className={cva('mt-10 sm:mx-auto sm:w-full sm:max-w-sm')()}>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit();
          }} className="space-y-6">
            <form.Field
              name="bearbeiter"
              validatorAdapter={zodValidator()}
              validators={{
                onSubmit: z.object({ name: z.string().trim().min(1, 'Es wird ein Bearbeiter benötigt') }),
              }}
            >
              {(field) => (
                <ComboInput<Bearbeiter>
                  items={allBearbeiterItems}
                  errors={field.state.meta.errors}
                  label="Anmelden als:"
                  addValueLabel="Bearbeiter anlegen:"
                  allowNewValues={true}
                  onAddNewValue={(name) => field.handleChange({ name, id: 'hans' })}
                  onChange={(e) => e && field.handleChange({
                    id: e,
                    name: allBearbeiter.data?.find(b => b.id === e)?.name ?? e,
                  })}
                  inputProps={{
                    name: field.name,
                    onBlur: field.handleBlur,
                    placeholder: allBearbeiter.isFetched ? 'Bearbeiter auswählen' : 'Bearbeiter laden...',
                  }}
                />
              )}
            </form.Field>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full"
                  color="blue"
                >
                  {isSubmitting ? 'Bearbeite...' : 'Mit der Bearbeitung beginnen'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>
      </div>
    );
  }
;