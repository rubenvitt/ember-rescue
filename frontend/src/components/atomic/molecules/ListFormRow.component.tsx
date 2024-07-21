import React from 'react';
import { useForm } from '@tanstack/react-form';
import { GenericFormProps } from '../organisms/GenericForm.component.js';
import { FormField } from './FormField.component.js';
import { BaseFormField } from '../../../types/formfield.types.js';
import { zodValidator } from '@tanstack/zod-form-adapter';

interface ListFormRowProps<T> {
  item: T;
  index: number;
  onSave: (updatedItem: T) => void;
  onDelete: () => void;
  formProps: Omit<GenericFormProps<T>, 'onSubmit' | 'defaultValues'>;
  renderFunctions?: {
    [K in keyof T]?: (value: T[K]) => React.ReactNode;
  };
  isNew?: boolean;
}

export function ListFormRow<T extends Record<string, any>>({
                                                             item,
                                                             onSave,
                                                             onDelete,
                                                             formProps,
                                                             renderFunctions,
                                                             isNew = false,
                                                           }: ListFormRowProps<T>) {
  const [isEditing, setIsEditing] = React.useState(isNew);

  const form = useForm<T>({
    defaultValues: item,
    onSubmit: async ({ value }) => {
      onSave(value);
      if (!isNew) {
        setIsEditing(false);
      }
    },
  });

  const getFieldConfig = (key: string): BaseFormField<T, any, any, any> => {
    const field = (formProps.sections[0] as any).fields.find((f: BaseFormField<T, any, any, any>) => f.name === key);
    if (field) {
      return field;
    }
    return {
      name: key,
      label: key,
      type: 'text',
      readonly: false,
    };
  };

  const handleCancel = () => {
    if (isNew) {
      onDelete();
    } else {
      setIsEditing(false);
      form.reset();
    }
  };

  const renderValue = (key: keyof T, value: T[keyof T]) => {
    if (renderFunctions && renderFunctions[key]) {
      return renderFunctions[key]!(value);
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <tr>
      {Object.entries(item).map(([key, value]) => (
        <td key={key} className="px-6 py-4 whitespace-nowrap">
          {isEditing ? (
            <form.Field
              name={key as any}
              validatorAdapter={zodValidator()}
              validators={getFieldConfig(key).validators}
            >
              {(fieldApi) => (
                <FormField
                  field={getFieldConfig(key)}
                  fieldApi={fieldApi}
                  layout={formProps.layout || 'simple'}
                />
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
              className="text-primary-600 hover:text-primary-900 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-primary-600 hover:text-primary-900 mr-2"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}