import { Button, ButtonProps, Form, FormInstance, FormProps } from 'antd';
import React, { useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

type Buttons = {
  buttons: { submit?: ButtonProps; reset?: ButtonProps; cancel?: ButtonProps };
  buttonContainerClassName?: string;
  isLoading?: boolean;
};

type Props<Values> = {
  type?: 'sectioned' | 'oneLine' | 'default';
  formInstance?: FormInstance<Values> & { onFinish?: (values: Values) => void | Promise<void>; onFinishFailed?: (errorInfo: any) => void | Promise<void> };
  children: ((props?: FormInstance<Values>) => React.ReactNode) | React.ReactNode;
  resetOnSubmit?: boolean;
  form?: FormProps<Values>;
} & Partial<Buttons>;

function SubmitButtons({ buttons: { submit, cancel, reset }, buttonContainerClassName, isLoading }: Buttons) {
  const context = Form.useFormInstance();
  const buttonCount = useMemo(() => {
    return [submit, reset, cancel].filter((button) => button !== undefined).length;
  }, [submit, reset, cancel]);
  return (
    <>
      <div className={twMerge(`grid grid-cols-${buttonCount} gap-4`, buttonContainerClassName)}>
        {cancel && (
          <Button
            {...cancel}
            disabled={isLoading}
            onClick={(event) => {
              context.resetFields();
              cancel?.onClick?.(event);
            }}
          ></Button>
        )}
        {reset && (
          <Button
            {...reset}
            disabled={isLoading}
            onClick={(event) => {
              context.resetFields();
              reset?.onClick?.(event);
            }}
          />
        )}
        {submit && (
          <Button
            {...submit}
            loading={isLoading}
            onClick={async (event) => {
              await context.validateFields();
              submit?.onClick?.(event);
              context.submit();
            }}
          />
        )}
      </div>
    </>
  );
}

const styling = cva('flex', {
  variants: {
    type: {
      default: 'flex flex-col',
      sectioned: 'flex-col gap-4',
      oneLine: 'flex flex-col sm:flex-row gap-2 sm:items-center justify-center justify-items-center',
    },
  },
});

export function FormLayout<Values = any>({ children, form, buttons, type = 'default', resetOnSubmit = false, formInstance }: Props<Values>): React.JSX.Element {
  const [antForm] = Form.useForm<Values>(formInstance);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOnFinish = useCallback(
    async (values: any) => {
      try {
        setIsLoading(true);
        await Promise.all([form?.onFinish?.(values)]);
        if (resetOnSubmit) {
          antForm.resetFields();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [form, resetOnSubmit, antForm],
  );

  const handleOnFinishFailed = useCallback(
    async (errorInfo: any) => {
      try {
        setIsLoading(true);
        await Promise.all([form?.onFinishFailed?.(errorInfo)]);
      } finally {
        setIsLoading(false);
      }
    },
    [form],
  );

  return (
    <Form<Values> {...form} onFinish={handleOnFinish} onFinishFailed={handleOnFinishFailed} form={antForm} className={twMerge(form?.className, styling({ type }))}>
      {typeof children === 'function' ? children(formInstance) : children}
      <SubmitButtons buttonContainerClassName={type === 'sectioned' ? 'mt-4' : ''} buttons={buttons ?? {}} isLoading={isLoading} />
    </Form>
  );
}
