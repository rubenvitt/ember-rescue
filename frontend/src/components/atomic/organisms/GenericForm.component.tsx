import { DeepKeys, DeepValue, useForm, Validator } from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import {
  BaseFormField,
  ComplexFormField,
  FormField,
  SimpleFormField,
  SimpleFormSection,
} from '../molecules/FormField.component.tsx';
import React, { forwardRef, useImperativeHandle } from 'react';


interface ComplexFormSection<
  TParentData,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> {
  title?: string;
  description?: string;
  fields: ComplexFormField<TParentData, DeepKeys<TParentData>, TFieldValidator, TFormValidator>[];
}

type FormSection<
  TParentData,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> =
  SimpleFormSection<TParentData, TFieldValidator, TFormValidator>
  | ComplexFormSection<TParentData, TFieldValidator, TFormValidator>;

export interface GenericFormProps<
  TFormData,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
> {
  sections: FormSection<TFormData, TFieldValidator, TFormValidator>[];
  onSubmit: (values: TFormData) => Promise<void> | void;
  onReset?: () => void;
  defaultValues?: TFormData;
  submitText?: string;
  resetText?: string;
  layout?: 'simple' | 'complex';
}

export interface GenericFormRef<TFormData> {
  form: ReturnType<typeof useForm<TFormData>>;
}

// @ts-ignore
export const GenericForm = forwardRef(function GenericForm<
  TFormData extends Record<string, any>,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
>(
  props: GenericFormProps<TFormData, TFieldValidator, TFormValidator>,
  ref: React.Ref<GenericFormRef<TFormData>>,
) {
  const {
    sections,
    onSubmit,
    onReset,
    defaultValues,
    submitText = 'Submit',
    resetText = 'Reset',
    layout = 'simple',
  } = props;
  const form = useForm<TFormData>({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  useImperativeHandle(ref, () => ({
    form,
  }), [form]);

  const getWidthClass = (field: BaseFormField<TFormData, any, TFieldValidator, TFormValidator>): string => {
    if (layout === 'complex') {
      return 'md:col-span-12 col-span-12';
    }
    if ('width' in field) {
      switch ((field as SimpleFormField<TFormData, any, TFieldValidator, TFormValidator>).width) {
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
      {// @ts-ignore
        sections.map((section, sectionIndex) => (
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
                  {// @ts-ignore
                    section.fields.map((field) => (
                      <form.Field
                        key={field.name}
                        name={field.name}
                        validators={field.validators}
                      >
                        {(fieldApi) => (
                          <div className={getWidthClass(field)}>
                            <label htmlFor={String(field.name)}
                                   className="block text-sm font-medium leading-6 text-gray-900">
                              {field.label}
                            </label>
                            <div className="mt-2">
                              <FormField field={field} fieldApi={fieldApi} layout={layout}
                                         allowNewValues={field.allowNewValues}
                                         onAddNewValue={field.onAddNewValue} />
                            </div>
                            {fieldApi.state.meta.isTouched && fieldApi.state.meta.errors && (
                              <p className="mt-2 text-sm text-red-600">{fieldApi.state.meta.errors.join(' ')}</p>
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
}) as <
  TFormData extends Record<string, any>,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
>(
  props: GenericFormProps<TFormData, TFieldValidator, TFormValidator> & { ref?: React.Ref<GenericFormRef<TFormData>> },
) => React.ReactElement;