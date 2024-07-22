import { DeepKeys, DeepValue, useForm, Validator } from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import { SimpleFormField } from './formfield.types.js';

export interface ComplexFormSection<
  TParentData,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> {
  title?: string;
  description?: string;
  fields: SimpleFormField<TParentData, DeepKeys<TParentData>, TFieldValidator, TFormValidator>[];
}

export interface SimpleFormSection<TParentData, TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined> {
  fields: SimpleFormField<TParentData, DeepKeys<TParentData>, TFieldValidator, TFormValidator>[];
}

export type FormSection<
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
  sections: FormSection<TFormData, TFieldValidator, TFormValidator>[],
  onSubmit: (values: TFormData) => Promise<void> | void,
  onReset?: () => void,
  defaultValues?: TFormData,
  submitText?: string,
  resetText?: string,
  layout?: 'simple' | 'complex',
}

export interface GenericFormRef<TFormData> {
  form: ReturnType<typeof useForm<TFormData>>;
}