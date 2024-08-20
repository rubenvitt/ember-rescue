import { Formik, useFormikContext } from 'formik';
import { FormikConfig, FormikValues } from 'formik/dist/types.js';
import { Button, ButtonProps, Form, FormProps } from 'antd';
import { ReactNode, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

type Buttons = {
  buttons: { submit?: ButtonProps; reset?: ButtonProps; cancel?: ButtonProps };
  buttonContainerClassName?: string;
}

type Props<Values extends FormikValues, ExtraProps = {}> = {
  type: 'sectioned';
  formik: FormikConfig<Values> & ExtraProps;
  children: ReactNode;
  form?: FormProps;
} & Partial<Buttons>

function SubmitButtons({ buttons: { submit, cancel, reset }, buttonContainerClassName }: Buttons) {
  const context = useFormikContext();
  const buttonCount = useMemo(() => {
    return [submit, reset, cancel].filter(button => button !== undefined).length;
  }, [submit, reset, cancel]);
  return <>
    <div className={twMerge(`grid grid-cols-${buttonCount} gap-4 mt-4`, buttonContainerClassName)}>
      {cancel && <Button {...cancel} onClick={(event) => {
        context.resetForm();
        cancel?.onClick?.(event);
      }}></Button>}
      {reset && <Button {...reset} onClick={(event) => {
        context.resetForm();
        reset?.onClick?.(event);
      }} />}
      {submit && <Button {...submit} onClick={async (event) => {
        await context.validateForm()
        console.log('Hi hier bin ich', context.errors, context.values)
        submit?.onClick?.(event);
        return context.submitForm();
      }} />}
    </div>
  </>;
}

export function FormLayout<Values extends FormikValues = FormikValues, ExtraProps = {}>({
                                                                                          formik,
                                                                                          children,
                                                                                          form,
                                                                                          buttons,
                                                                                        }: Props<Values, ExtraProps>): JSX.Element {
  return <Formik {...formik}>
    <Form {...form} className={twMerge(form?.className, 'flex flex-col gap-4')}>
      {children}
      <SubmitButtons buttons={buttons ?? {}} />
    </Form>
  </Formik>;
}