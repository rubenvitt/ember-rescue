import { ValidationError } from '@tanstack/react-form';
import { useMemo } from 'react';

export const useValidation = (errors?: ValidationError[]) => {
  const cleanedErrors = useMemo(() => {
    return errors?.filter((err: ValidationError) => Boolean(err));
  }, [errors]);

  const hasErrors = useMemo(() => (cleanedErrors?.length ?? 0) > 0, [cleanedErrors]);

  return { cleanedErrors, hasErrors };
};