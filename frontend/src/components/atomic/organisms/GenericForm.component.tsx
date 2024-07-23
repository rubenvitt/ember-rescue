import {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldValidators,
  useForm,
  ValidationError,
  Validator,
} from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { FormField } from '../molecules/FormField.component.js';
import { BaseFormField, SimpleFormField } from '../../../types/formfield.types.js';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { ValidatedInput } from '../atoms/inputs/validated-input.component.js';
import { ZodType, ZodTypeDef } from 'zod';
import { buttonContainerStyles, formStyles } from '../../../styles/form.styles.ts';
import { FormSection } from './FormSection.js';
import { GenericFormProps, GenericFormRef } from '../../../types/form.types.ts';
import { Button } from '../molecules/Button.component.tsx';
import { PiArrowArcRight } from 'react-icons/pi';


export const GenericForm = forwardRef(function GenericForm<
  TFormData extends Record<string, any>,
  TFieldValidator extends Validator<DeepValue<TFormData, DeepKeys<TFormData>, Optional<TFormData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined
>(
  {
    defaultValues,
    layout = 'simple',
    onReset,
    onSubmit,
    resetText = 'Reset',
    sections,
    submitText = 'Submit',
  }: GenericFormProps<TFormData, TFieldValidator, TFormValidator>,
  ref: React.Ref<GenericFormRef<TFormData>>,
) {
  const form = useForm<TFormData>({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
  useImperativeHandle(ref, () => ({ form }), [form]);

  const getWidthClass = useCallback((field: BaseFormField<TFormData, any, TFieldValidator, TFormValidator>): string => {
    if (layout === 'complex') return 'md:col-span-12 col-span-12';
    if ('width' in field) {
      const widthMap = {
        half: 'md:col-span-6 col-span-12',
        third: 'md:col-span-4 col-span-12',
        quarter: 'md:col-span-3 col-span-12',
        'two-thirds': 'md:col-span-8 col-span-12',
        'three-quarters': 'md:col-span-9 col-span-12',
        full: 'md:col-span-12 col-span-12',
      };
      return widthMap[(field as SimpleFormField<TFormData, any, TFieldValidator, TFormValidator>).width as keyof typeof widthMap] || 'md:col-span-12 col-span-12';
    }
    return 'md:col-span-12';
  }, [layout]);

  const renderFields = useCallback((fields: BaseFormField<TFormData, any, TFieldValidator, TFormValidator>[]) => fields.map((field) => (
    <form.Field
      key={field.name}
      name={field.name}
      validatorAdapter={zodValidator()}
      validators={field.validators as FieldValidators<TFormData, any, () => {
        validate({ value }: { value: unknown }, fn: ZodType<any, ZodTypeDef, any>): ValidationError;
        validateAsync({ value }: { value: unknown }, fn: ZodType<any, ZodTypeDef, any>): Promise<ValidationError>;
      }, undefined, DeepValue<TFormData, any>>}
    >
      {(fieldApi) => (
        <div className={getWidthClass(field)}>
          <label htmlFor={String(field.name)}
                 className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
            {field.label}
          </label>
          <div className="mt-2">
            <ValidatedInput meta={fieldApi.state.meta}>
              <FormField
                field={field}
                fieldApi={fieldApi as FieldApi<TFormData, any, undefined, undefined, DeepValue<TFormData, any>>}
                layout={layout}
                allowNewValues={field.allowNewValues}
                onAddNewValue={field.onAddNewValue}
              />
            </ValidatedInput>
          </div>
        </div>
      )}
    </form.Field>
  )), []);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }} className={formStyles({ layout })}>
      {sections.map((section, index) => (
        <FormSection key={index} section={section} layout={layout} renderFields={renderFields} />
      ))}
      <div className={buttonContainerStyles({ layout })}>
        {onReset && (
          <Button type="button" onClick={onReset} intent="outline">{resetText}</Button>
        )}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} color="primary" icon={PiArrowArcRight} iconPosition="right">
              {isSubmitting ? 'Submitting...' : submitText}
            </Button>
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