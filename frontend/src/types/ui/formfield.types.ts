import { Optional } from '@ark-ui/react';
import { DeepKeys, DeepValue, FieldValidators, Validator } from '@tanstack/react-form';
import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import { Identifiable } from '../utils/common.types.js';

export type FieldType =
  'text'
  | 'date'
  | 'datetime-local'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio'
  | 'combo'
  | 'number';

export interface BaseFormField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
> {
  name: TName;
  label?: string;
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