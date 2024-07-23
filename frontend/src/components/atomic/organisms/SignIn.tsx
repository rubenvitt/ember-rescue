import React, { useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { Bearbeiter, NewBearbeiter } from '../../../types/types.js';
import { ComboInput, ItemType } from '../molecules/Combobox.component.js';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Button } from '../molecules/Button.component.tsx';
import { PiGear } from 'react-icons/pi';
import { cva } from 'class-variance-authority';
import { useWindowSetup } from '../../../hooks/window.hook.ts';
import { LogicalSize } from '@tauri-apps/api/window';


export const SignIn: React.FC = () => {
  const { saveBearbeiter, allBearbeiter } = useBearbeiter();
  const navigate = useNavigate({ from: '/signin' });
  const allBearbeiterItems = React.useMemo<ItemType<Bearbeiter>[]>(() =>
      allBearbeiter.data?.map((item: Bearbeiter) => ({
        label: item.name,
        item,
      })) ?? [],
    [allBearbeiter.data]);

  useWindowSetup({
    title: 'Project Rescue • Anmelden',
    alwaysOnTop: true,
    center: true,
    resizable: false,
    size: new LogicalSize(400, 600),
  });

  const formSubmit = useCallback(({ value }: { value: { bearbeiter: Bearbeiter | NewBearbeiter } }) =>
      saveBearbeiter(value.bearbeiter).then(() => navigate({ to: '/app' })),
    [saveBearbeiter, navigate]);

  const form = useForm<{ bearbeiter: Bearbeiter | NewBearbeiter }>({
    defaultValues: { bearbeiter: { name: '', id: null } },
    onSubmit: formSubmit,
  });

  const handleSettingsClick = useCallback(() => navigate({ to: '/prestart/settings' }), [navigate]);

  return (
    <div className={cva('flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative')()}>
      <div className="absolute top-4 right-4">
        <Button
          onClick={handleSettingsClick}
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
};