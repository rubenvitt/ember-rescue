import { useCallback, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { Bearbeiter, NewBearbeiter } from '../../../types/types.js';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';
import { Button } from '../../deprecated/button.js';
import { ComboInput, ItemType } from '../molecules/Combobox.component.js';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

export function SignIn() {
  const { saveBearbeiter, allBearbeiter } = useBearbeiter();
  const navigate = useNavigate({ from: '/signin' });
  const allBearbeiterItems = useMemo<ItemType<Bearbeiter>[]>(() => {
    return allBearbeiter.data?.map((item: Bearbeiter) => ({
      label: item.name,
      item,
    })) ?? [];
  }, [allBearbeiter]);

  useMemo(async () => {
    const window = getCurrent();
    await window.setTitle('Project Rescue • Anmelden');
    await window.setFullscreen(false);
    await window.setSize(new LogicalSize(400, 600));
    await window.center();
    await window.setAlwaysOnTop(true);
    await window.setResizable(false);
  }, []);

  const formSubmit = useCallback(({ value }: {
    value: { bearbeiter: Bearbeiter | NewBearbeiter }
  }) => saveBearbeiter(value.bearbeiter).then(async () => {
    await navigate({
      to: '/app',
    });
  }), [saveBearbeiter, navigate]);

  const form = useForm<{ bearbeiter: Bearbeiter | NewBearbeiter }>({
    defaultValues: {
      bearbeiter: { name: '', id: null },
    },
    onSubmit: formSubmit,
  });

  const handleSettingsClick = useCallback(async () => {
    await navigate({
      to: '/prestart/settings',
    });
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSettingsClick}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Einstellungen"
        >
          <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-36 w-auto"
          src="/logo.png"
          alt="Project Rescue Logo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          Project Rescue • Anmelden
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
        }} className="space-y-6">
          <div>
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
                  onAddNewValue={(name) => {
                    field.handleChange({
                      name,
                      id: 'hans',
                    });
                  }}
                  onChange={(e) =>
                    e && field.handleChange({
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
          </div>
          <div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full"
                  color="primary"
                >
                  {isSubmitting ? 'Bearbeite...' : 'Mit der Bearbeitung beginnen'}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}