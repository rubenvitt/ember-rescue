import { cva } from 'class-variance-authority';
import React from 'react';
import {
  BaseInputProps,
  CheckboxInputProps,
  ComboInputProps,
  RadioInputProps,
  SelectInputProps,
} from '../../../types/ui/inputs.types.js';
import { ComboInput } from '../molecules/Combobox.component.js';
import { useValidation } from '../../../hooks/validation.hook.js';
import { Identifiable } from '../../../types/utils/common.types.js';

const inputStyles = cva('w-full rounded-md border-0 bg-white pb-1.5 pl-3 pr-12 text-gray-900 dark:text-white dark:bg-gray-900/80 dark:placeholder:text-gray-200 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6', {
  variants: {
    hasErrors: {
      true: 'ring-red-500 focus:ring-red-500 placeholder:text-red-300 text-red-900',
      false: 'ring-gray-300 focus:ring-primary-600',
    },
  },
});

export const TextInput: React.FC<BaseInputProps> = ({
                                                      name,
                                                      value,
                                                      onChange,
                                                      onBlur,
                                                      placeholder,
                                                      className,
                                                      readOnly,
                                                      errors,
                                                    }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <input
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      type="text"
      placeholder={placeholder}
      className={`${inputStyles({ hasErrors })} ${className}`}
      readOnly={readOnly}
    />
  );
};

export const DateInput: React.FC<BaseInputProps> = ({ name, value, onChange, onBlur, className, readOnly, errors }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <input
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      type="date"
      className={`${inputStyles({ hasErrors })} ${className}`}
      readOnly={readOnly}
    />
  );
};

export const DateTimeInput: React.FC<BaseInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          className,
                                                          readOnly,
                                                          errors,
                                                        }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <input
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      type="datetime-local"
      className={`${inputStyles({ hasErrors })} ${className}`}
      readOnly={readOnly}
    />
  );
};

export const PasswordInput: React.FC<BaseInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          placeholder,
                                                          className,
                                                          readOnly,
                                                          errors,
                                                        }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <input
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      type="password"
      placeholder={placeholder}
      className={`${inputStyles({ hasErrors })} ${className}`}
      readOnly={readOnly}
    />
  );
};


export const NumberInput: React.FC<BaseInputProps> = ({
                                                        name,
                                                        value,
                                                        onChange,
                                                        onBlur,
                                                        placeholder,
                                                        className,
                                                        readOnly,
                                                        errors,
                                                      }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <input
      name={name}
      value={value as number}
      onChange={onChange}
      onBlur={onBlur}
      type="number"
      placeholder={placeholder}
      className={`${inputStyles({ hasErrors })} ${className}`}
      readOnly={readOnly}
    />
  );
};

export const SelectInput: React.FC<SelectInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          className,
                                                          readOnly,
                                                          options,
                                                          errors,
                                                        }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <select
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      className={`${inputStyles({ hasErrors })} ${className}`}
      disabled={readOnly}
    >
      {options?.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
};

export const TextareaInput: React.FC<BaseInputProps> = ({
                                                          name,
                                                          value,
                                                          onChange,
                                                          onBlur,
                                                          placeholder,
                                                          className,
                                                          readOnly,
                                                          errors,
                                                        }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <textarea
      name={name}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      rows={3}
      className={`${inputStyles({ hasErrors })} ${className}`}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({
                                                              name,
                                                              checked,
                                                              onChange,
                                                              className,
                                                              readOnly,
                                                              errors,
                                                            }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <div className={`flex items-center ${hasErrors ? 'text-red-500' : ''}`}>
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`${className}`}
        readOnly={readOnly}
      />
      <label htmlFor={name} className="ml-2">
        {name}
      </label>
    </div>
  );
};

export const RadioInput: React.FC<RadioInputProps> = ({
                                                        name,
                                                        value,
                                                        onChange,
                                                        className,
                                                        readOnly,
                                                        options,
                                                        errors,
                                                      }) => {
  const { hasErrors } = useValidation(errors);

  return (
    <div className={`flex flex-col ${hasErrors ? 'text-red-500' : ''}`}>
      {options?.map((option) => (
        <label key={option} className="inline-flex items-center">
          <input
            type="radio"
            name={name}
            value={option}
            checked={option === value}
            onChange={onChange}
            className={`${className}`}
            readOnly={readOnly}
          />
          <span className="ml-2">{option}</span>
        </label>
      ))}
    </div>
  );
};

export const ComboInputWrapper: React.FC<ComboInputProps<Identifiable>> = ({
                                                                             ...props
                                                                           }) => {
  return (
    <ComboInput
      {...props}
    />
  );
};