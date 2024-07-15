import { DeepKeys, DeepValue, FieldApi, FieldValidators, Validator } from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import { ComboInput, ItemType } from './Combobox.component.js';
import { Identifiable } from '../../../types.js';

type FieldType = 'text' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'combo' | 'number';

export interface BaseFormField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> {
  name: TName;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  items?: ItemType<Identifiable>[];
  validators?: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator>;
  readonly?: boolean;
  allowNewValues?: boolean;
  onAddNewValue?: (newValue: string) => void;
}

export interface SimpleFormField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> extends BaseFormField<TParentData, TName, TFieldValidator, TFormValidator> {
  width?: 'full' | 'half' | 'third' | 'quarter' | 'two-thirds' | 'three-quarters' | 'auto';
}

export type ComplexFormField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> = BaseFormField<TParentData, TName, TFieldValidator, TFormValidator>;

export interface SimpleFormSection<
  TParentData,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> {
  fields: SimpleFormField<TParentData, DeepKeys<TParentData>, TFieldValidator, TFormValidator>[];
}

export function FormField<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
>({
    field,
    fieldApi,
    layout,
    onAddNewValue,
    allowNewValues,
  }: {
  field: BaseFormField<TFormData, TName, TFieldValidator, TFormValidator>;
  fieldApi: FieldApi<TFormData, TName>;
  layout: 'simple' | 'complex';
  allowNewValues?: boolean;
  onAddNewValue?: (newValue: string) => void;
}) {
  const baseInputClasses = `${layout === 'complex'
    ? 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6'
    : 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'} ${
    field.readonly ? 'bg-gray-100 cursor-not-allowed' : ''
  }`;

  const handleChange = (value: any) => {
    if (!field.readonly) {
      fieldApi.setValue(value);
    }
  };

  switch (field.type) {
    case 'text':
    case 'date':
    case 'datetime-local':
    case 'number':
      return (
        <input
          name={String(fieldApi.name)}
          value={fieldApi.state.value as string}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={fieldApi.handleBlur}
          type={field.type}
          placeholder={field.placeholder}
          className={baseInputClasses}
          readOnly={field.readonly}
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
          disabled={field.readonly}
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
          readOnly={field.readonly}
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
          className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ${field.readonly ? 'cursor-not-allowed' : ''}`}
          disabled={field.readonly}
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
                className={`h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 ${field.readonly ? 'cursor-not-allowed' : ''}`}
                disabled={field.readonly}
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
          disabled={field.readonly}
          allowNewValues={allowNewValues}
          onAddNewValue={(val: string) => {
            if (allowNewValues && onAddNewValue) {
              onAddNewValue(val);
              handleChange(val);
            }
          }}
        />
      );
    default:
      return null;
  }
}