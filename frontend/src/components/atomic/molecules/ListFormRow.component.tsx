import React, { useCallback, useMemo } from 'react';
import { useForm } from '@tanstack/react-form';
import { FormField } from './FormField.component.js';
import { BaseFormField } from '../../../types/ui/formfield.types.js';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { cva } from 'class-variance-authority';
import { ValidatedInput } from '../atoms/inputs/validated-input.component.js';
import { GenericFormProps } from '../../../types/ui/form.types.js';

interface ListFormRowProps<T> {
  item: T;
  onSave: (updatedItem: T) => void;
  onDelete: () => void;
  formProps: Omit<GenericFormProps<T>, 'defaultValues' | 'onSubmit'>;
  renderFunctions?: Partial<Record<keyof T, (value: T[keyof T]) => React.ReactNode>>;
  isNew?: boolean;
  produceDefaultItem?: (item: T) => T;
}

const buttonStyles = cva('px-2 py-1 rounded', {
  variants: {
    intent: {
      primary: 'text-primary-600 hover:text-primary-900',
      secondary: 'text-gray-600 hover:text-gray-900',
      danger: 'text-red-600 hover:text-red-900',
    },
  },
  defaultVariants: {
    intent: 'primary',
  },
});

export function ListFormRow<T extends Record<string, any>>({
                                                             item,
                                                             onSave,
                                                             onDelete,
                                                             formProps,
                                                             renderFunctions,
                                                             produceDefaultItem,
                                                             isNew = false,
                                                           }: ListFormRowProps<T>) {
  const [isEditing, setIsEditing] = React.useState(isNew);

  const form = useForm<T>({
    defaultValues: produceDefaultItem?.(item) ?? item,
    onSubmit: useCallback(
      async ({ value }: { value: T }) => {
        onSave(value);
        if (!isNew) {
          setIsEditing(false);
        }
      },
      [onSave, isNew],
    ),
  });

  const getFieldConfig = useCallback(
    (key: string): BaseFormField<T, any, any, any> => {
      const field = formProps.sections?.[0].fields.find(
        (f: BaseFormField<T, any, any, any>) => f.name === key,
      );
      return (
        field || {
          name: key,
          label: key,
          type: 'text',
          readonly: false,
        }
      );
    },
    [formProps.sections],
  );

  const handleCancel = useCallback(() => {
    if (isNew) {
      onDelete();
    } else {
      setIsEditing(false);
      form.reset();
    }
  }, [isNew, onDelete, form]);

  const renderValue = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      if (renderFunctions?.[key]) {
        return renderFunctions[key]!(value);
      }
      return typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value);
    },
    [renderFunctions],
  );

  const itemEntries = useMemo(() => Object.entries(item), [item]);

  return (
    <tr>
      {itemEntries.map(([key, value]) => (
        <td key={key} className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            <form.Field
              name={key as any}
              validatorAdapter={zodValidator()}
              validators={getFieldConfig(key).validators}
            >
              {(fieldApi) => (
                <ValidatedInput meta={fieldApi.state.meta}>
                  <FormField
                    field={getFieldConfig(key)}
                    fieldApi={fieldApi}
                    layout={formProps.layout || 'simple'}
                  />
                </ValidatedInput>
              )}
            </form.Field>
          ) : (
            renderValue(key as keyof T, value)
          )}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isEditing ? (
          <>
            <button
              onClick={() => form.handleSubmit()}
              type="submit"
              className={buttonStyles({ intent: 'primary' })}
            >
              Speichern
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className={buttonStyles({ intent: 'secondary' })}
            >
              Abbrechen
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className={buttonStyles({ intent: 'primary' })}
            >
              Bearbeiten
            </button>
            <button
              onClick={onDelete}
              type="button"
              className={buttonStyles({ intent: 'danger' })}
            >
              Löschen
            </button>
          </>
        )}
      </td>
    </tr>
  );
}