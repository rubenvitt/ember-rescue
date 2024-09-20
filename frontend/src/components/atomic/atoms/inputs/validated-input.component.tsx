import React from 'react';
import { useValidation } from '../../../../hooks/validation.hook.js';
import { FieldMeta, ValidationError } from '@tanstack/react-form';

export const ValidatedInput: React.FC<React.PropsWithChildren<{ meta: FieldMeta }>> = ({ meta, children }) => {
  const { hasErrors, cleanedErrors } = useValidation(meta.errors);
  return (
    <>
      {children}
      {meta.isTouched && hasErrors && (
        <div className="mt-2 text-sm text-red-600">
          {cleanedErrors?.map((error: ValidationError) => <p key={error?.toString()}>{error || ''}</p>)}
        </div>
      )}
    </>
  );
};
