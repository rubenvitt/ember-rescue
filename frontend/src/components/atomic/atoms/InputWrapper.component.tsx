import { Form } from 'formik-antd';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: React.ReactNode;
  label?: string;
  name: string;
  className?: string;
}

export function InputWrapper({ label, children, name, className }: Props) {
  return (
    <Form.Item className={twMerge('flex flex-col gap-2', className)} name={name}>
      {label && <label htmlFor={name}>{label}</label>}
      {children}
    </Form.Item>
  );
}
