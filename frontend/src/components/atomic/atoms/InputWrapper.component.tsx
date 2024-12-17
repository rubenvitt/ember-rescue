import { Form, FormItemProps } from 'antd';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: React.ReactNode;
  label?: string;
  name: string;
  className?: string;
} & FormItemProps;

export function InputWrapper({ label, children, name, className, ...itemProps }: Props) {
  return (
    <Form.Item className={twMerge('flex flex-col gap-2', className)} name={name} {...itemProps}>
      {JSON.stringify(itemProps.validateStatus)}
      {label && (
        <label className="text-black dark:text-white" htmlFor={name}>
          {label}
        </label>
      )}
      {children}
    </Form.Item>
  );
}
