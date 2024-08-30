import { useCallback } from 'react';
import { CreateNotizDto } from '../../../../types/app/notes.types.js';
import { Button, Card } from 'antd';
import { Input } from 'formik-antd';
import { PiAlarm, PiNote } from 'react-icons/pi';
import * as Yup from 'yup';
import { InputWrapper } from '../../atoms/InputWrapper.component.js';
import { FormLayout } from '../../organisms/form/FormLayout.comonent.js';

type EmptyStateProps = {
  addNote: (note: CreateNotizDto) => void;
};

const CreateNotizSchema = Yup.object().shape({
  content: Yup.string().required('Um etwas zu notieren, sollte eine Notiz angegeben werden.'),
});

export function EmptyState({ addNote }: EmptyStateProps) {
  const handleSubmit = useCallback((data: CreateNotizDto) => {
    addNote(data);
  }, [addNote]);

  return (
    <FormLayout<CreateNotizDto> type="sectioned" formik={{
      validationSchema: CreateNotizSchema,
      initialValues: { content: '' },
      onSubmit: (data) => handleSubmit(data),
    }}>
      {(props) => (
        <Card classNames={{
          actions: 'bg-green-500',
        }} actions={[
          <div className="flex gap-x-4 justify-center">
            <Button
              icon={<PiNote />}
              type="primary"
              onClick={() => {
                props.handleSubmit();
              }}
            >
              Notiz anlegen
            </Button>
            <Button
              icon={<PiAlarm />}
              onClick={() => props.handleSubmit()}
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