import { Form } from 'formik-antd';
import React from 'react';

interface Props {
  children: React.ReactNode;
  label: string;
  name: string;
}

export function InputWithLabel({ label, children, name }: Props) {
  return (
    <div className="space-y-2">
      <Form.Item name={name}>
        <label htmlFor={name}>{label}</label>
        {children}
      </Form.Item>
    </div>
  );
}