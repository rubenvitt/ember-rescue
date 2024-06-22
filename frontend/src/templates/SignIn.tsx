import { useForm } from '@tanstack/react-form';
import { useBearbeiter } from '../hooks/bearbeiter.hook.js';
import { Bearbeiter, NewBearbeiter } from '../types.js';
import { ComboInput } from '../components/catalyst-components/combobox.js';

export function SignIn() {
  const { saveBearbeiter } = useBearbeiter();

  let form = useForm<{ bearbeiter: Bearbeiter | NewBearbeiter }>({
    defaultValues: {
      bearbeiter: { name: '', id: null },
    },
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      saveBearbeiter(values.value.bearbeiter);
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
                  <ComboInput
                    items={[{ id: '1', label: 'Alice' }, { id: '2', label: 'Bob' }, { id: '3', label: 'Charlie' }]}
                    errors={field.state.meta.errors}
                    labelText="Anmelden als:"
                    inputProps={{
                      name: field.name,
                      onBlur: field.handleBlur,
                      onChange: (e) => field.handleChange({ id: e?.id || 'test', name: e?.label ?? '' }),
                      required: true,
                      placeholder: 'Bearbeiter auswählen',
                    }}
                  />
                </>
              )} />
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Mit der Bearbeitung beginnen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
    ;
}
