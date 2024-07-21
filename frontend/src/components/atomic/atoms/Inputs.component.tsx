import { ComboInput } from '../molecules/Combobox.component.js';
import React from 'react';
import { Identifiable } from '../../../types/types.js';
import { BaseInputProps, CheckboxInputProps, ComboInputProps, RadioInputProps } from '../../../types/inputs.types.ts';

export const TextInput: React.FC<BaseInputProps> = ({
                                                      name,
                                                      value,
                                                      onChange,
                                                      onBlur,
                                                      placeholder,
                                                      className,
                                                      readOnly,
                                                    }) => (
  <input
    name={name}
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    type="text"
    placeholder={placeholder}
    className={className}
    readOnly={readOnly}
  />
);

export const DateInput: React.FC<BaseInputProps> = ({ name, value, onChange, onBlur, className, readOnly }) => (
  <input
    name={name}
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    type="date"
    className={className}
    readOnly={readOnly}
  />
);

export const DateTimeInput: React.FC<BaseInputProps> = ({ name, value, onChange, onBlur, className, readOnly }) => (
  <input
    name={name}
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    type="datetime-local"
    className={className}
    readOnly={readOnly}
  />
);

export const NumberInput: React.FC<BaseInputProps> = ({
                                                        name,
                                                        value,
                                                        onChange,
                                                        onBlur,
                                                        placeholder,
                                                        className,
                                                        readOnly,
                                                      }) => (
  <input
    name={name}
    value={value as number}
    onChange={onChange}
    onBlur={onBlur}
    type="number"
    placeholder={placeholder}
    className={className}
    readOnly={readOnly}
  />
);

export const SelectInput: React.FC<SelectInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          className,
                                                          readOnly,
                                                          options,
                                                        }) => (
  <select
    name={name}
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    className={className}
    disabled={readOnly}
  >
    {options?.map((option) => (
      <option key={option} value={option}>{option}</option>
    ))}
  </select>
);

export const TextareaInput: React.FC<BaseInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          placeholder,
                                                          className,
                                                          readOnly,
                                                        }) => (
  <textarea
    name={name}
    value={value as string}
    onChange={onChange}
    onBlur={onBlur}
    rows={3}
    className={className}
    placeholder={placeholder}
    readOnly={readOnly}
  />
);

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
                                                              name,
                                                              checked,
                                                              onChange,
                                                              onBlur,
                                                              className,
                                                              readOnly,
                                                            }) => (
  <input
    name={name}
    checked={checked}
    onChange={onChange}
    onBlur={onBlur}
    type="checkbox"
    className={className}
    disabled={readOnly}
  />
);

export const RadioInput: React.FC<RadioInputProps> = ({
                                                        name,
                                                        value,
                                                        onChange,
                                                        onBlur,
                                                        className,
                                                        readOnly,
                                                        options,
                                                      }) => (
  <>
    {options?.map((option) => (
      <div key={option} className="flex items-center">
        <input
          name={name}
          checked={value === option}
          onChange={onChange}
          onBlur={onBlur}
          type="radio"
          value={option}
          className={className}
          disabled={readOnly}
        />
        <label className="ml-2 block text-sm text-gray-900">{option}</label>
      </div>
    ))}
  </>
);

export const ComboInputWrapper: React.FC<ComboInputProps<Identifiable>> = ({
                                                                             items,
                                                                             onChange,
                                                                             defaultItem,
                                                                             ...props
                                                                           }) => {
  return (
    <ComboInput
      items={items}
      onChange={onChange}
      defaultItem={defaultItem}
      {...props}
    />
  );
};