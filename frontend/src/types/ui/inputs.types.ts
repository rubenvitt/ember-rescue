import { ItemType } from '../../components/atomic/molecules/Combobox.component.js';
import React from 'react';
import { ValidationError } from '@tanstack/react-form';
import { Identifiable } from '../utils/common.types.js';

export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export interface BaseInputProps {
  name: string;
  value: string | number | readonly string[];
  onChange: (e: ChangeEvent) => void;
  onBlur: () => void;
  className: string;
  readOnly?: boolean;
  placeholder?: string;
  errors?: ValidationError[];
}

export interface SelectInputProps extends BaseInputProps {
  options?: string[];
}

export interface CheckboxInputProps extends Omit<BaseInputProps, 'value'> {
  checked: boolean;
}

export interface RadioInputProps extends BaseInputProps {
  options?: string[];
}

export interface ComboInputProps<Item extends Identifiable> {
  items: ItemType<Item>[],
  onChange: (id: string | null) => void,
  defaultItem?: ItemType<Item>,
  label?: string,
  disabled?: boolean,
  allowNewValues?: boolean,
  onAddNewValue?: (newValue: string) => void,
  addValueLabel?: string,
  errors?: ValidationError[],
  inputProps?: Pick<React.ComponentPropsWithoutRef<'input'>, 'name' | 'onBlur' | 'required' | 'placeholder'>,
}