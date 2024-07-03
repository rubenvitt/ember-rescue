import { FieldApi, useForm } from '@tanstack/react-form';
import { ComboInput, ItemType } from '../molecules/Combobox.component.js';
import { Identifiable } from '../../../types.js';

type FieldType = 'text' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'combo';

interface BaseFormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  items?: ItemType<Identifiable>[];
}

interface SimpleFormField extends BaseFormField {
  width?: 'full' | 'half' | 'third' | 'quarter' | 'two-thirds' | 'three-quarters' | 'auto';
}

type ComplexFormField = BaseFormField;

interface SimpleFormSection {
  fields: SimpleFormField[];
}

interface ComplexFormSection {
  title?: string;
  description?: string;
  fields: ComplexFormField[];
}

type FormSection = SimpleFormSection | ComplexFormSection;

interface GenericFormProps<TFormData> {
  sections: FormSection[];
  onSubmit: (values: TFormData) => Promise<void> | void;
  onReset?: () => void;
  defaultValues: TFormData;
  submitText?: string;
  resetText?: string;
}

function FormField<TFormData>({
                                field,
                                fieldApi,
                                layout,
                              }: {
  field: BaseFormField;
  fieldApi: FieldApi<TFormData, any>;
  layout: 'simple' | 'complex';
}) {
  const baseInputClasses = layout === 'complex'
    ? 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
    : 'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm';

  const handleChange = (value: any) => {
    fieldApi.setValue(value);
  };

  switch (field.type) {
    case 'text':
    case 'date':
    case 'datetime-local':
      return (
        <input
          name={String(fieldApi.name)}
          value={fieldApi.state.value as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          type={field.type}
          placeholder={field.placeholder}
          className={baseInputClasses}
        />
      );
    case 'select':
      return (
        <select
          name={String(fieldApi.name)}
          value={fieldApi.state.value as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          className={`${baseInputClasses} ${layout === 'complex' ? 'sm:max-w-xs' : ''}`}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    case 'textarea':
      return (
        <textarea
          name={String(fieldApi.name)}
          value={fieldApi.state.value as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          rows={3}
          className={baseInputClasses}
          placeholder={field.placeholder}
        />
      );
    case 'checkbox':
      return (
        <input
          name={String(fieldApi.name)}
          checked={fieldApi.state.value as boolean}
          onChange={(e) => handleChange(e.target.checked)}
          onBlur={fieldApi.handleBlur}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      );
    case 'radio':
      return (
        <>
          {field.options?.map((option) => (
            <div key={option} className="flex items-center">
              <input
                name={String(fieldApi.name)}
                checked={(fieldApi.state.value as string) === option}
                onChange={() => handleChange(option)}
                onBlur={fieldApi.handleBlur}
                type="radio"
                value={option}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 block text-sm text-gray-900">{option}</label>
            </div>
          ))}
        </>
      );
    case 'combo':
      return (
        <ComboInput
          items={field.items as ItemType<Identifiable>[]}
          onChange={(item) => handleChange(item)}
        />
      );
    default:
      return null;
  }
}

export function GenericForm<TFormData extends Record<string, any>>({
                                                                     sections,
                                                                     onSubmit,
                                                                     onReset,
                                                                     defaultValues,
                                                                     submitText = 'Submit',
                                                                     resetText = 'Reset',
                                                                   }: GenericFormProps<TFormData>) {
  const form = useForm<TFormData>({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const layout: 'simple' | 'complex' = 'title' in (sections[0] || {}) ? 'complex' : 'simple';

  const getWidthClass = (field: BaseFormField): string => {
    if (layout === 'complex') {
      return 'md:col-span-12 col-span-12';
    }
    if ('width' in field) {
      switch ((field as SimpleFormField).width) {
        case 'half':
          return 'md:col-span-6 col-span-12';
        case 'third':
          return 'md:col-span-4 col-span-12';
        case 'quarter':
          return 'md:col-span-3 col-span-12';
        case 'two-thirds':
          return 'md:col-span-8 col-span-12';
        case 'three-quarters':
          return 'md:col-span-9 col-span-12';
        case 'full':
        default:
          return 'md:col-span-12 col-span-12';
      }
    }
    return 'md:col-span-12';
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }} className={layout === 'complex' ? 'space-y-10 divide-y divide-gray-900/10' : 'space-y-8'}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}
             className={layout === 'complex' ? 'grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3' : ''}>
          {(layout === 'complex' && ('title' in section ? (
            <div className="px-4 sm:px-0">
              {section.title && <h2 className="text-base font-semibold leading-7 text-gray-900">{section.title}</h2>}
              {section.description && <p className="mt-1 text-sm leading-6 text-gray-600">{section.description}</p>}
            </div>
          ) : (<div>{/* placeholder */}</div>)))}
          <div
            className={layout === 'complex' ? 'bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2' : ''}>
            <div className={layout === 'complex' ? 'px-4 py-6 sm:p-8' : ''}>
              <div className={`grid grid-cols-12 gap-6`}>
                {section.fields.map((field) => (
                  <form.Field
                    key={field.name}
                    name={field.name as any}
                  >
                    {(fieldApi) => (
                      <div className={getWidthClass(field)}>
                        <label htmlFor={field.name} className="block text-sm font-medium leading-6 text-gray-900">
                          {field.label}
                        </label>
                        <div className="mt-2">
                          <FormField field={field} fieldApi={fieldApi} layout={layout} />
                        </div>
                        {fieldApi.state.meta.touchedErrors && (
                          <p className="mt-2 text-sm text-red-600">{fieldApi.state.meta.touchedErrors.join(' ')}</p>
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
      <div
        className={`${layout === 'complex' ? 'mt-6 flex items-center justify-end gap-x-6' : 'flex justify-end space-x-3'}`}>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            {resetText}
          </button>
        )}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className={`${layout === 'complex'
                ? 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                : 'inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              }`}
            >
              {isSubmitting ? 'Submitting...' : submitText}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}