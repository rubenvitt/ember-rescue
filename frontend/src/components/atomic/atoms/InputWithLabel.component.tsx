import React from 'react';
import { FormikFieldProps } from 'formik-antd/lib/FieldProps.js';

interface Props {
  children: React.ReactNode;
  label: string;
}

export function InputWithLabel({ label, children, name }: Props & Pick<FormikFieldProps, 'name'>) {
  return (
    <div className="space-y-2">
      <label htmlFor={name}>{label}</label>
      {children}
    </div>
  );
}