import { DeepKeys, FieldApi, FieldValidators, useForm } from '@tanstack/react-form';
import { ComboInput, ItemType } from '../molecules/Combobox.component.js';
import { Identifiable } from '../../../types.js';

type FieldType = 'text' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'combo';


type FormField<TData> = {
  name: keyof TData & string;
  label: string;
  placeholder?: string;
  validators?: FieldValidators<TData, DeepKeys<TData>>;
} & ({ type: Exclude<FieldType, 'combo'>, options?: string[], items?: never } | {
  type: 'combo',
  items: ItemType<Identifiable>[],
  options?: never
});

interface FormSection<TData> {
  title: string;
  description?: string;
  fields: FormField<TData>[];
}

interface GenericFormProps<TFormData> {
  sections: FormSection<TFormData>[];
  onSubmit: (values: TFormData) => Promise<void> | void;
  onReset?: () => void;
  defaultValues: TFormData;
}

const FormField = <TFormData, >({
                                  field,
                                  fieldApi,
                                }: {
  field: FormField<TFormData>;
  fieldApi: FieldApi<TFormData, any, any, any, any>
}) => {
  switch (field.type) {
    case 'text':
    case 'date':
    case 'datetime-local':
      return (
        <input
          name={String(fieldApi.name)}
          value={fieldApi.state.value as string}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          type={field.type}
          placeholder={field.placeholder}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
        />
      );
    case 'select':
      return (
        <select
          name={String(fieldApi.name)}
          value={fieldApi.state.value}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case 'textarea':
      return (
        <textarea
          name={String(fieldApi.name)}
          value={fieldApi.state.value}
          onChange={(e) => fieldApi.handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          rows={3}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
          placeholder={field.placeholder}
        />
      );
    case 'checkbox':
      return (
        <input
          name={String(fieldApi.name)}
          checked={fieldApi.state.value}
          onChange={(e) => fieldApi.handleChange(e.target.checked)}
          onBlur={fieldApi.handleBlur}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-600"
        />
      );
    case 'radio':
      return (
        <>
          {field.options?.map((option) => (
            <div key={option} className="flex items-center gap-x-3">
              <input
                name={String(fieldApi.name)}
                checked={fieldApi.state.value === option}
                onChange={() => fieldApi.handleChange(option)}
                onBlur={fieldApi.handleBlur}
                type="radio"
                value={option}
                className="h-4 w-4 border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-600"
              />
              <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                {option}
              </label>
            </div>
          ))}
        </>
      );
    case 'combo':
      return (
        <>
          <ComboInput
            items={(field.items as ItemType<Identifiable>[])}
            onChange={(item) => {
              fieldApi.handleChange(item);
            }} />
        </>
      );
    default:
      return null;
  }
};

export function GenericForm<TFormData extends Record<string, any>>({
                                                                     sections,
                                                                     onSubmit,
                                                                     onReset,
                                                                     defaultValues,
                                                                   }: GenericFormProps<TFormData>) {
  const form = useForm<TFormData>({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <div className="p-6 md:p-12 lg:px-0 lg:p-24 flex flex-col items-center">
      <div className="space-y-10 divide-y divide-gray-900/10 dark:divide-gray-100/10 max-w-4xl w-full">
        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
          {sections.map((section, index) => (
            <div key={index} className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{section.title}</h2>
                {section.description && (
                  <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{section.description}</p>
                )}
              </div>

              <div
                className="bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {section.fields.map((field) => (
                      <form.Field
                        key={field.name}
                        name={field.name as DeepKeys<TFormData>}
                        validators={field.validators}
                      >
                        {(fieldApi) => (
                          <div className="sm:col-span-4">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                            >
                              {field.label}
                            </label>
                            <div className="mt-2">
                              <FormField field={field} fieldApi={fieldApi} />
                            </div>
                            {fieldApi.state.meta.touchedErrors && (
                              <p
                                className="mt-2 text-sm text-red-600">{fieldApi.state.meta.touchedErrors.join(' ')}</p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              onClick={() => {
                if (onReset) onReset();
                else form.reset();
              }}
            >
              Abbrechen
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {isSubmitting ? 'Absenden...' : 'Absenden'}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}