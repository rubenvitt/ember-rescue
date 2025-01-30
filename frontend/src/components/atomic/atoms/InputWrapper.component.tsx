import { Form, FormItemProps } from 'antd';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: React.ReactNode;
  name: string;
  className?: string;
} & FormItemProps;

export function InputWrapper({ children, name, className, ...itemProps }: Props) {
  return (
    <Form.Item className={twMerge('flex flex-col gap-2', className)} name={name} {...itemProps}>
      {children}
    </Form.Item>
  );
}
