import { useForm } from '@tanstack/react-form';
import { useBearbeiter } from '../../../hooks/bearbeiter.hook.js';
import { Bearbeiter, NewBearbeiter } from '../../../types.js';
import { BearbeiterInput } from '../molecules/BearbeiterInput.component.js';
import { getCurrent, LogicalSize } from '@tauri-apps/api/window';
import { useCallback, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function SignIn() {
  const { saveBearbeiter, allBearbeiter } = useBearbeiter();
  const navigate = useNavigate({ from: '/signin' });

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
  }), [saveBearbeiter]);

  let form = useForm<{ bearbeiter: Bearbeiter | NewBearbeiter }>({
    defaultValues: {
      bearbeiter: { name: '', id: null },
    },
    onSubmit: formSubmit,
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-36 w-auto"
          src="/logo.png"
          alt="Project Rescue Logo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
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
              validators={{
                onSubmit: (value) => {
                  console.log('Validating bearbeiter:', value);
                  if (!value?.value.name) {
                    return 'Bitte wählen Sie einen Bearbeiter aus.';
                  }
                },
              }}
              children={(field) => (<>
                  <BearbeiterInput
                    items={allBearbeiter.data || []}
                    errors={field.state.meta.errors}
                    labelText="Anmelden als:"
                    inputProps={{
                      name: field.name,
                      onBlur: field.handleBlur,
                      onChange: (e) => field.handleChange({ id: e?.id || 'test', name: e?.name ?? '' }),
                      required: true,
                      placeholder: allBearbeiter.isFetched ? 'Bearbeiter auswählen' : 'Bearbeiter laden...',
                    }}
                  />
                </>
              )} />
          </div>
          <div>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isSubmitting ? 'Bearbeite...' : 'Mit der Bearbeitung beginnen'}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  )
    ;
}
