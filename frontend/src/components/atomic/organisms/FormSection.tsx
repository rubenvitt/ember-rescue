import { DeepKeys, DeepValue, Validator } from '@tanstack/react-form';
import { Optional } from '@ark-ui/react';
import { SimpleFormField } from '../../../types/ui/formfield.types.js';
import React from 'react';
import { fieldContainerStyles, fieldGridStyles, sectionStyles } from '../../../styles/form.styles.js';
import { FormSection as TFormSection } from '../../../types/ui/form.types.ts';

export const FormSection = <
  TParentData,
  TFieldValidator extends Validator<DeepValue<TParentData, DeepKeys<TParentData>, Optional<TParentData>>, unknown> | undefined = any,
  TFormValidator extends Validator<TParentData, unknown> | undefined = undefined
>({ section, layout, renderFields }: {
  section: TFormSection<TParentData, TFieldValidator, TFormValidator>,
  layout: 'simple' | 'complex',
  renderFields: (fields: SimpleFormField<TParentData, DeepKeys<TParentData>, TFieldValidator, TFormValidator>[]) => React.ReactNode
}) => (
  <div className={sectionStyles({ layout })}>
    {layout === 'complex' && 'title' in section && (
      <div className="px-4 sm:px-0">
        {section.title &&
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">{section.title}</h2>}
        {section.description &&
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{section.description}</p>}
      </div>
    )}
    <div className={fieldContainerStyles({ layout })}>
      <div className={fieldGridStyles({ layout })}>
        {renderFields(section.fields)}
      </div>
    </div>
  </div>
);