import { useCallback } from 'react';
import { CreateNotizDto, NotizDto } from '../../../../types/app/notes.types.js';
import { Button, Card } from 'antd';
import { Input } from 'formik-antd';
import { PiAlarm, PiNote } from 'react-icons/pi';
import * as Yup from 'yup';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';
import { useReminders } from '../../../../hooks/reminders.hook.js';
import { FormikHelpers } from 'formik/dist/types.js';

type EmptyStateProps = {
  addNote: (note: CreateNotizDto) => Promise<NotizDto> | undefined;
};

const CreateNotizSchema = Yup.object().shape({
  content: Yup.string().required('Um etwas zu notieren, sollte eine Notiz angegeben werden.'),
});

export function EmptyState({ addNote }: EmptyStateProps) {
  const { actualCreateReminder } = useReminders();
  const handleSubmit = useCallback(async (data: CreateNotizDto & { reminder: boolean }, formik: FormikHelpers<any>) => {
    await addNote({ content: data.content })?.then((notiz) => {
      if (data.reminder) {
        actualCreateReminder(notiz.id, {
          onOk: formik.resetForm,
        });
      }
    });
  }, [addNote, actualCreateReminder]);

  return (
    <FormLayout<CreateNotizDto & { reminder: boolean }> type="sectioned" formik={{
      validationSchema: CreateNotizSchema,
      validateOnChange: false,
      initialValues: { content: '', reminder: false },
      onSubmit: (data, formikHelpers) => handleSubmit(data, formikHelpers),
    }}>
      {(props) => (
        <Card classNames={{
          actions: 'bg-green-500',
        }} actions={[
          <div className="flex gap-x-4 justify-center">
            <Button
              icon={<PiNote />}
              type="primary"
              onClick={async () => {
                await props.setFieldValue('reminder', false);
                props.handleSubmit();
              }}
            >
              Notiz anlegen
            </Button>
            <Button
              icon={<PiAlarm />}
              onClick={async () => {
                await props.setFieldValue('reminder', true);
                props.handleSubmit();
              }}
            >
              Erinnerung anlegen
            </Button>
          </div>,
        ]}>
          <InputWrapper name={'content'}>
            <Input.TextArea
              name="content"
              rows={5}
              onBlur={() => {
                // do nothing
              }}
              placeholder="Inhalt der Notiz oder Erinnerung"
            />
          </InputWrapper>
        </Card>
      )}
    </FormLayout>
  );
}