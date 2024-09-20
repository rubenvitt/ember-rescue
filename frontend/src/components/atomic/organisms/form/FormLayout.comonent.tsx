import { Formik, useFormikContext } from 'formik';
import { FormikConfig, FormikProps, FormikValues } from 'formik/dist/types.js';
import { Button, ButtonProps, Form, FormProps } from 'antd';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

type Buttons = {
  buttons: { submit?: ButtonProps; reset?: ButtonProps; cancel?: ButtonProps };
  buttonContainerClassName?: string;
  resetOnSubmit?: boolean;
};

type Props<Values extends FormikValues, ExtraProps = {}> = {
  type?: 'sectioned' | 'oneLine' | 'default';
  formik: FormikConfig<Values> & ExtraProps;
  children: ((props: FormikProps<Values>) => React.ReactNode) | React.ReactNode;
  form?: FormProps;
} & Partial<Buttons>;

function SubmitButtons({ buttons: { submit, cancel, reset }, buttonContainerClassName, resetOnSubmit }: Buttons) {
  const context = useFormikContext();
  const buttonCount = useMemo(() => {
    return [submit, reset, cancel].filter((button) => button !== undefined).length;
  }, [submit, reset, cancel]);
  return (
    <>
      <div className={twMerge(`grid grid-cols-${buttonCount} gap-4`, buttonContainerClassName)}>
        {cancel && (
          <Button
            {...cancel}
            onClick={(event) => {
              context.resetForm();
              cancel?.onClick?.(event);
            }}
          ></Button>
        )}
        {reset && (
          <Button
            {...reset}
            onClick={(event) => {
              context.resetForm();
              reset?.onClick?.(event);
            }}
          />
        )}
        {submit && (
          <Button
            {...submit}
            onClick={async (event) => {
              await context.validateForm();
              console.log('Hi hier bin ich', context.errors, context.values);
              submit?.onClick?.(event);
              return context.submitForm().then(() => {
                if (resetOnSubmit) {
                  context.resetForm();
                }
              });
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

export function FormLayout<Values extends FormikValues = FormikValues, ExtraProps = {}>({
  formik,
  children,
  form,
  buttons,
  type = 'default',
  resetOnSubmit = false,
}: Props<Values, ExtraProps>): React.JSX.Element {
  return (
    <Formik {...formik}>
      {(props: FormikProps<Values>) => (
        <Form {...form} className={twMerge(form?.className, styling({ type }))}>
          {typeof children === 'function' ? children(props) : children}
          <SubmitButtons
            buttonContainerClassName={type === 'sectioned' ? 'mt-4' : ''}
            buttons={buttons ?? {}}
            resetOnSubmit={resetOnSubmit}
          />
        </Form>
      )}
    </Formik>
  );
}
