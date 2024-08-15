import { inputStyles } from '../../../styles/formfield.styles.js';
import {
  CheckboxInput,
  ComboInputWrapper,
  DateInput,
  DateTimeInput,
  NumberInput,
  PasswordInput,
  RadioInput,
  TextareaInput,
  TextInput,
} from '../atoms/Inputs.component.js';
import { ItemType } from './Combobox.component.js';
import { DeepKeys, DeepValue, FieldApi, Validator } from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import { BaseFormField } from '../../../types/ui/formfield.types.js';
import { ChangeEvent } from '../../../types/ui/inputs.types.ts';
import { useValidation } from '../../../hooks/validation.hook.js';
import { Identifiable } from '../../../types/utils/common.types.js';
import { Select } from 'antd';

export function FormField<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>({
    field,
    fieldApi,
    layout,
    onAddNewValue,
    allowNewValues,
  }: Readonly<{
  field: BaseFormField<TFormData, TName, TFieldValidator, TFormValidator>;
  fieldApi: FieldApi<TFormData, TName>;
  layout: 'simple' | 'complex';
  allowNewValues?: boolean;
  onAddNewValue?: (newValue: string) => void;
}>) {
  const { hasErrors } = useValidation(fieldApi.state.meta.errors);
  const inputClasses = inputStyles({ layout, readonly: field.readonly, hasErrors });

  const handleChange = (value: any) => {
    if (!field.readonly) {
      fieldApi.setValue(value);
    }
  };

  const commonProps = {
    name: String(fieldApi.name),
    value: fieldApi.state.value as string,
    onChange: (e: ChangeEvent) => handleChange(e.target.value),
    onBlur: fieldApi.handleBlur,
    className: inputClasses,
    readOnly: field.readonly,
    placeholder: field.placeholder,
  };

  switch (field.type) {
    case 'text':
      return <TextInput {...commonProps} />;
    case 'date':
      return <DateInput {...commonProps} />;
    case 'datetime-local':
      return <DateTimeInput {...commonProps} />;
      case 'password':
        return <PasswordInput {...commonProps} />;
    case 'number':
      return <NumberInput {...commonProps} />;
    case 'select':
      return <Select />
    case 'textarea':
      return <TextareaInput {...commonProps} />;
    case 'checkbox':
      return <CheckboxInput {...commonProps} checked={fieldApi.state.value as boolean} />;
    case 'radio':
      return <RadioInput {...commonProps} options={field.options} />;
    case 'combo':
      const defaultItem = field.items?.find(item => item.item.id === fieldApi.state.value)
        ?? (allowNewValues ? {
          item: { id: '' },
          label: fieldApi.state.value,
        } as ItemType<Identifiable> : undefined);
      return (
        <ComboInputWrapper
          items={field.items as ItemType<Identifiable>[]}
          defaultItem={defaultItem}
          onChange={(item) => handleChange(item)}
          disabled={field.readonly}
          allowNewValues={allowNewValues}
          onAddNewValue={(val: string) => {
            if (allowNewValues && onAddNewValue) {
              onAddNewValue(val);
              handleChange(val);
            }
          }}
          errors={fieldApi.state.meta.errors}
        />
      );
    default:
      return null;
  }
}